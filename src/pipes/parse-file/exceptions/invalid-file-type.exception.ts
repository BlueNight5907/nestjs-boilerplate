import { BaseException } from 'common/exception/BaseException';
import { ERROR_CODE } from 'common/exception/error-code';

export class InvalidFileTypeException extends BaseException {
  private fileTypes: string[];

  private field?: string;

  constructor(fileTypes: string[], field?: string) {
    super({
      code: ERROR_CODE.INVALID_FILE_TYPE,
      args: { value: fileTypes.join(', ') },
    });

    this.fileTypes = fileTypes;
    this.field = field;
  }

  get message(): string {
    if (!this.field) {
      return `File extension should be one of the following value: ${this.fileTypes.join(
        ', ',
      )}`;
    }

    return `File extension of field "${
      this.field
    }" should be one of the following value: ${this.fileTypes.join(', ')}`;
  }
}
