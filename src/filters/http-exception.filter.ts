import {
  type ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseException, ERROR_CODE } from 'common/exception';

import { BaseFilter, type IParseExceptionResult } from './base.filter';

@Catch(HttpException)
export class HttpExceptionFilter extends BaseFilter {
  private handleCommonHttpException(
    exception: HttpException,
  ): IParseExceptionResult & Record<string, unknown> {
    const body: IParseExceptionResult & Record<string, unknown> = {
      code: ERROR_CODE.HTTP_UNHANDLED,
      message: exception.message,
      status: exception.getStatus(),
      type: exception.name,
    };

    if (exception instanceof NotFoundException) {
      body.code = ERROR_CODE.HTTP_NOT_FOUND;
    }

    if (exception instanceof UnauthorizedException) {
      body.code = ERROR_CODE.HTTP_UNAUTHORIZED;
    }

    return body;
  }

  handleAppException(
    exception: BaseException,
    status: number,
  ): IParseExceptionResult & Record<string, unknown> {
    return {
      status,
      message: exception.message,
      code: exception.code,
      type: exception.constructor.name,
      args: exception.args,
    };
  }

  protected parseException(
    exception: HttpException,
    _host: ArgumentsHost,
  ): IParseExceptionResult & Record<string, unknown> {
    const status = HttpStatus.BAD_REQUEST;
    const exceptionContent = exception.getResponse() as string | BaseException;

    if (exceptionContent instanceof BaseException) {
      return this.handleAppException(exceptionContent, status);
    }

    return this.handleCommonHttpException(exception);
  }
}
