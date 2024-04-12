import {
  type ArgumentsHost,
  Catch,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseException, ERROR_CODE } from 'common/exception';

import { BaseFilter, type IParseExceptionResult } from './base.filter';

@Catch(HttpException)
export class HttpExceptionFilter extends BaseFilter {
  private handleHttpExceptionResponse(
    exception: HttpException,
  ): IParseExceptionResult {
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

  handleAppExceptionResponse(
    exception: BaseException,
    status: number,
  ): IParseExceptionResult {
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
  ): IParseExceptionResult {
    const exceptionContent = exception.getResponse() as string | BaseException;

    if (exceptionContent instanceof BaseException) {
      return this.handleAppExceptionResponse(
        exceptionContent,
        exception.getStatus(),
      );
    }

    return this.handleHttpExceptionResponse(exception);
  }
}
