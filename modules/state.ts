export interface ApplicationState {
  password: string;
  passwordLength: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  strength: {
    text: string;
    drawing: string;
  };
}

export abstract class AbstractStateManager {
  abstract state: ApplicationState;
  abstract password(value?: string | undefined): string;
  abstract passwordLength(value?: number | undefined): number;
  abstract strengthText(): string;
  abstract strengthDrawing(): string;
  abstract updateOption(value: unknown): any;
}
