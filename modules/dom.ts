import { generate, GeneratorOutput, Strength } from "./generator";
import { AbstractStateManager, ApplicationState } from "./state";
import { getLines } from "./utils";

const options: Option[] = [
  "includeUppercase",
  "includeLowercase",
  "includeNumbers",
  "includeSymbols",
];

type Option =
  | "includeUppercase"
  | "includeLowercase"
  | "includeNumbers"
  | "includeSymbols";

function el(id: string) {
  return document.getElementById(id);
}

function checkDOM() {
  return typeof window !== "undefined" && !!window.document;
}

function updateEl(el: HTMLElement | null, value: string) {
  el!.innerText = value;
}

class DOMStateManager implements AbstractStateManager {
  state: ApplicationState = {
    password: "",
    passwordLength: 10,
    includeUppercase: false,
    includeLowercase: false,
    includeNumbers: false,
    includeSymbols: false,
    strength: {
      text: "",
      drawing: "",
    },
  };

  password(value?: string | undefined): string {
    if (value) this.state.password = value;
    const passwordEl = el("password_display");
    updateEl(passwordEl, this.state.password);
    return this.state.password;
  }
  passwordLength(value?: number | undefined): number {
    if (value) this.state.passwordLength = value;
    const lengthEl = el("password_length");
    updateEl(lengthEl, String(value));
    return this.state.passwordLength;
  }
  strengthText(value?: string): string {
    if (value) this.state.strength.text = value;
    const strengthTxtEl = el("strength-text");
    updateEl(strengthTxtEl, this.state.strength.text);
    return this.state.strength.text;
  }
  strengthDrawing(value?: string): string {
    if (value) this.state.strength.drawing = value;
    const strengthIcon = el("strength-drawing");
    updateEl(strengthIcon, this.state.strength.drawing);
    return this.state.strength.drawing;
  }
  updateOption(option: { key: string | null; value: boolean }) {
    const key = option.key as Option;
    const value = option.value;

    if (key && options.includes(key)) {
      this.state[key] = value;
    }
  }
}

export const domManager = new DOMStateManager();

export function renderToDOM(output: GeneratorOutput) {
  if (!checkDOM) return;

  const { password, strength } = output;
  domManager.password(password);
  domManager.passwordLength(password.length);
  domManager.strengthText(strength);
  domManager.strengthDrawing(getLines(strength as Strength));
}

export function attachListeners() {
  const generateButton = el("generate-button");
  const copyButton = el("copy-button");
  const lengthSlider = el("length_slider");
  const options = document.querySelectorAll("[name=option]");

  lengthSlider!.addEventListener("input", (e) => {
    const target = e.target;
    if (target instanceof HTMLInputElement) {
      domManager.passwordLength(+target.value);
    }
  });

  options.forEach((option) => {
    if (option instanceof HTMLInputElement) {
      option.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        const value = {
          key: target.getAttribute("data-state-selector"),
          value: target.checked,
        };

        domManager.updateOption(value);
      });
    }
  });

  generateButton!.addEventListener("click", () => {
    const { state } = domManager;
    const output = generate({
      includeNumbers: state.includeNumbers,
      includeSymbols: state.includeSymbols,
      uppercase: state.includeUppercase,
      lowercase: state.includeLowercase,
      length: state.passwordLength,
    });

    renderToDOM(output);
  });

  copyButton!.addEventListener("click", () => {
    const { password } = domManager.state;

    if ("clipboard" in window.navigator) {
      window.navigator.clipboard.writeText(password);
      updateEl(copyButton, "Copied!");

      setTimeout(() => {
        updateEl(copyButton, "Copy");
      }, 3000);
    }
  });
}
