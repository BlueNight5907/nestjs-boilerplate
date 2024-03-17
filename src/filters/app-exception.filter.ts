import { type ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseException } from 'common/exception';

import { BaseFilter, type IParseExceptionResult } from './base.filter';

@Catch(BaseException)
export class AppExceptionsFilter extends BaseFilter {
  protected parseException(
    exception: BaseException,
    _host: ArgumentsHost,
  ): IParseExceptionResult & Record<string, unknown> {
    const status = HttpStatus.BAD_REQUEST;

    return {
      status,
      message: exception.message,
      code: exception.code,
      type: exception.constructor.name,
      args: exception.args,
    };
  }
}
