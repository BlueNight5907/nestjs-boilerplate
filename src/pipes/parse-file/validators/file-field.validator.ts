import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseException } from 'common/exception';
import { type IFile } from 'definitions/interfaces';

import {
  FileIsRequiredException,
  InvalidFileTypeException,
  MaxFileSizeException,
} from '../exceptions';
import {
  type IFileFieldValidationOptions,
  type IFileValidator,
} from './IFileValidator';

export class FileFieldValidator implements IFileValidator {
  constructor(
    private readonly optionsArr: IFileFieldValidationOptions[] = [],
  ) {}

  private checkAndValidate(file: IFile, options: IFileFieldValidationOptions) {
    if (options.maxFileSize && options.maxFileSize < file.size) {
      throw new MaxFileSizeException(options.maxFileSize, options.field);
    }

    const fileExtension = file.originalname.split('.').at(-1);

    if (
      options.fileTypes &&
      options.fileTypes.every((fileType) => fileType !== fileExtension)
    ) {
      throw new InvalidFileTypeException(options.fileTypes, options.field);
    }
  }

  validate(fileMapping: Record<string, IFile[]>): void {
    try {
      for (const options of this.optionsArr) {
        const files = <IFile[] | undefined>fileMapping[options.field] ?? [];

        if (options.fileIsRequired && files.length === 0) {
          throw new FileIsRequiredException(options.field);
        }

        for (const file of files) {
          this.checkAndValidate(file, options);
        }
      }
    } catch (error) {
      if (error instanceof BaseException) {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }

      throw error;
    }
  }
}
