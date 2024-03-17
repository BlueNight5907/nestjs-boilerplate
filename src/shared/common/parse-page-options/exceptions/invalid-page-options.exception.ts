import { ERROR_CODE } from 'common/exception';
import { BaseException } from 'common/exception/BaseException';

export class InvalidPageOptionsException extends BaseException {
  private invalidQuery: string;

  get message(): string {
    return `Invalid page options query: ${this.invalidQuery}`;
  }

  constructor(invalidQuery: string) {
    super({
      code: ERROR_CODE.INVALID_PAGE_OPTIONS,
      args: {
        invalidQuery,
      },
    });
    this.invalidQuery = invalidQuery;
  }
}
