import { randItem } from "./utils";

export interface GeneratorOptions {
  uppercase: boolean;
  lowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  length?: number;
}

export interface GeneratorOutput {
  password: string;
  strength: string;
  score?: number;
}

const allowedCharacters = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  lower: "abcdefghijklmnopqrstuvwxyz".split(""),
  symbol: "!@#$-_+".split(""),
  numbers: "0123456789".split(""),
};

type AllowedCategory = keyof typeof allowedCharacters;

function filterCategory(
  options: Omit<GeneratorOptions, "length">,
  category: AllowedCategory
) {
  const { uppercase, lowercase, includeNumbers, includeSymbols } = options;

  // default case: no options selected
  if (!(uppercase || lowercase || includeNumbers || includeSymbols)) {
    return true;
  }

  switch (category) {
    case "upper":
      return uppercase;
    case "lower":
      return lowercase;
    case "symbol":
      return includeSymbols;
    case "numbers":
      return includeNumbers;

    default:
      return true;
  }
}

function createRandomCharacter(options: Omit<GeneratorOptions, "length">) {
  const screener = filterCategory.bind(null, options);
  const allowed = Object.entries(allowedCharacters).filter(([category]) =>
    screener(category as AllowedCategory)
  );

  const randCategory = randItem(allowed);
  const char = randItem(randCategory[1]);
  return char;
}

function calcScore(password: string) {
  let score = 10;
  const twoConsecutive = /(.)\1/;
  const threeConsecutive = /(.)\1(.)/;
  const containsSymbols = new RegExp(
    `[${allowedCharacters.symbol.join("]|[")}]`
  );

  // checking for consecutive chars
  if (threeConsecutive.test(password)) {
    score -= 3;
  } else if (twoConsecutive.test(password)) {
    score -= 2;
  }

  if (!containsSymbols.test(password)) {
    score -= 3;
  }

  if (password.length < 8) {
    score -= 5;
  }

  if (password.length < 5) {
    score -= 5;
  }

  return score;
}

function calcStrength(score: number) {
  if (score <= 2) {
    return "Week";
  }

  if (score <= 5) {
    return "Medium";
  }

  if (score <= 8) {
    return "Strong";
  }

  return "Very Strong";
}

export type Strength = ReturnType<typeof calcStrength>;

export function generate(options: GeneratorOptions): GeneratorOutput {
  const { length = 10, ...otherOptions } = options;

  let password = "";

  for (let i = 1; i <= length; i++) {
    const randChar = createRandomCharacter(otherOptions);
    password += randChar;
  }

  const score = calcScore(password);
  const strength = calcStrength(score);

  return {
    password,
    strength,
    score,
  };
}
