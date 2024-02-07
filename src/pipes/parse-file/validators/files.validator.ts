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

export class FilesValidator implements IFileValidator {
  constructor(private readonly options: IFileValidationOptions = {}) {}

  validate(files?: IFile[]): void {
    if (!files || files.length === 0) {
      if (this.options.fileIsRequired) {
        throw new FileIsRequiredException();
      }

      return;
    }

    for (const file of files) {
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
}
