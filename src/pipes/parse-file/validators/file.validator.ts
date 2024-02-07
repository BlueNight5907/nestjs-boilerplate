import {
  FileIsRequiredException,
  InvalidFileTypeException,
  MaxFileSizeException,
} from 'exceptions/file';
import { type IFile } from 'interfaces';

import {
  type IFileValidationOptions,
  type IFileValidator,
} from './IFileValidator';

export class FileValidator implements IFileValidator {
  constructor(private readonly options: IFileValidationOptions = {}) {}

  validate(file?: IFile): void {
    if (!file) {
      if (this.options.fileIsRequired) {
        throw new FileIsRequiredException();
      }

      return;
    }

    if (this.options.maxFileSize && this.options.maxFileSize < file.size) {
      throw new MaxFileSizeException(this.options.maxFileSize);
    }

    const fileExtension = file.originalname.split('.').at(-1);

    if (
      this.options.fileTypes &&
      this.options.fileTypes.every((fileType) => fileType !== fileExtension)
    ) {
      throw new InvalidFileTypeException(this.options.fileTypes);
    }
  }
}
