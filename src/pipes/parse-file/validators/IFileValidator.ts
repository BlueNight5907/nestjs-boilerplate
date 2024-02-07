export interface IFileValidationOptions {
  fileIsRequired?: boolean;
  maxFileSize?: number;
  fileTypes?: string[];
}

export interface IFileFieldValidationOption extends IFileValidationOptions {
  fileName: string;
}

export interface IFileValidator {
  validate(files: unknown): void;
}
