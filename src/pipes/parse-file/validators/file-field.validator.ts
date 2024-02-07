import {
  FileIsRequiredException,
  InvalidFileTypeException,
  MaxFileSizeException,
} from 'exceptions/file';
import { type IFile } from 'interfaces';

import {
  type IFileFieldValidationOption,
  type IFileValidator,
} from './IFileValidator';

export class FileFieldValidator implements IFileValidator {
  constructor(private readonly optionsArr: IFileFieldValidationOption[] = []) {}

  validate(fileMapping: Record<string, IFile[]>): void {
    for (const options of this.optionsArr) {
      const files = <IFile[] | undefined>fileMapping[options.fileName] ?? [];

      if (options.fileIsRequired && files.length === 0) {
        throw new FileIsRequiredException();
      }

      for (const file of files) {
        if (options.maxFileSize && options.maxFileSize < file.size) {
          throw new MaxFileSizeException(options.maxFileSize);
        }

        const fileExtension = file.originalname.split('.').at(-1);

        if (
          options.fileTypes &&
          options.fileTypes.every((fileType) => fileType !== fileExtension)
        ) {
          throw new InvalidFileTypeException(options.fileTypes);
        }
      }
    }
  }
}
