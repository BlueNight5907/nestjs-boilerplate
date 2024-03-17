export interface IFileValidationOptions {
  fileIsRequired?: boolean;
  maxFileSize?: number;
  fileTypes?: string[];
  field?: string;
}

export interface IFileFieldValidationOptions extends IFileValidationOptions {
  field: string;
}

export interface IFileValidator {
  validate(files: unknown): void;
}
