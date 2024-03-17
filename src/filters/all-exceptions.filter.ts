import { type ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { ERROR_CODE } from 'common/exception';

import { BaseFilter, type IParseExceptionResult } from './base.filter';

@Catch()
export class AllExceptionsFilter extends BaseFilter {
  protected parseException(
    _exception: Error,
    _host: ArgumentsHost,
  ): IParseExceptionResult & Record<string, unknown> {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    return {
      code: ERROR_CODE.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
      status,
      type: 'InternalServerError',
    };
  }
}
