import { Strength } from "./generator";

export const randItem = <T extends unknown[]>(arr: T): T[number] => {
  const randomIndex = Math.round(Math.random() * (arr.length - 1));
  return arr[randomIndex];
};

export function getLines(strength: Strength) {
  const linesDict: Record<Strength, number> = {
    Week: 1,
    Medium: 2,
    Strong: 3,
    "Very Strong": 4,
  };

  const length = linesDict[strength];
  let lines = "";

  for (let i = 1; i <= length; i++) {
    lines += "|";
  }

  lines = lines.split("").join(" ");
  return lines;
}
