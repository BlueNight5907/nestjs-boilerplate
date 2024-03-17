import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseException } from 'common/exception';
import { type IFile } from 'definitions/interfaces';

import {
  FileIsRequiredException,
  InvalidFileTypeException,
  MaxFileSizeException,
} from '../exceptions';
import {
  type IFileValidationOptions,
  type IFileValidator,
} from './IFileValidator';

export class FileValidator implements IFileValidator {
  constructor(private readonly options: IFileValidationOptions = {}) {}

  validate(file?: IFile): void {
    try {
      if (!file) {
        if (this.options.fileIsRequired) {
          throw new FileIsRequiredException(this.options.field);
        }

        return;
      }

      if (this.options.maxFileSize && this.options.maxFileSize < file.size) {
        throw new MaxFileSizeException(
          this.options.maxFileSize,
          this.options.field,
        );
      }

      const fileExtension = file.originalname.split('.').at(-1);

      if (
        this.options.fileTypes &&
        this.options.fileTypes.every((fileType) => fileType !== fileExtension)
      ) {
        throw new InvalidFileTypeException(
          this.options.fileTypes,
          this.options.field,
        );
      }
    } catch (error) {
      if (error instanceof BaseException) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }

      throw error;
    }
  }
}
