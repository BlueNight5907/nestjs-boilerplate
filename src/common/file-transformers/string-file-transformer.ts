import { BaseError } from 'common/BaseError';
import { ERROR_CODE } from 'exceptions/error-code';
import { type IFileTransformer } from 'shared/interfaces';
import { ERROR_MESSAGE_KEY } from 'translation-keys';

export class ReadFileErrorException extends BaseError {
  constructor(path: string) {
    super({
      code: ERROR_CODE.READ_FILE_ERROR,
      message: ERROR_MESSAGE_KEY.READ_FILE_ERROR,
      args: { path },
    });
  }
}

export class StringFileTransformer implements IFileTransformer<string> {
  transform(fileBuffer: Buffer, path: string): string {
    try {
      return fileBuffer.toString();
    } catch {
      throw new ReadFileErrorException(path);
    }
  }
}
export const defaultStringFileTransformer = new StringFileTransformer();
