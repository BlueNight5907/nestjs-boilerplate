import { BaseException } from 'common/exception/BaseException';
import { ERROR_CODE } from 'common/exception/error-code';

import { type IFileTransformer } from '../IFileTransformer';

export class ReadFileErrorException extends BaseException {
  private path: string;

  constructor(path: string) {
    super({
      code: ERROR_CODE.READ_FILE_ERROR,
      args: { path },
    });
    this.path = path;
  }

  get message(): string {
    return `Unable to read file from ${this.path}`;
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
