import { type ArgumentsHost, type ExceptionFilter } from '@nestjs/common';
import { type IExceptionResponse } from 'definitions/interfaces';
import { type Request, type Response } from 'express';
import { ContextProvider } from 'providers';
import { type ITranslationService } from 'shared/common/translation';
import { v4 } from 'uuid';

export interface IParseExceptionResult {
  code: string;
  status: number;
  message: string;
  type: string;
  args?: Record<string, unknown>;
  [optionsName: string]: any;
}

export abstract class BaseFilter implements ExceptionFilter {
  constructor(protected readonly translationService: ITranslationService) {}

  protected abstract parseException(
    exception: unknown,
    host: ArgumentsHost,
  ): IParseExceptionResult;

  private buildResponseBody(
    data: Omit<IParseExceptionResult, 'status'>,
    request: Request,
  ): IExceptionResponse {
    const id = ContextProvider.getCurrentContextId() ?? v4();
    const url = `${request.protocol}://${request.get('host')}${
      request.originalUrl
    }`;
    const method = request.method;
    const { code, message, type, args, ...others } = data;

    return {
      id,
      type,
      code,
      message,
      args,
      method,
      path: request.path,
      url,
      timestamp: new Date(),

      ...others,
    };
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const request: Request & {
      skipAuditLog?: boolean;
    } = host.switchToHttp().getRequest();
    const response: Response = host.switchToHttp().getResponse();

    const { status, ...others } = this.parseException(exception, host);

    const responseBody = this.buildResponseBody(others, request);

    response.status(status).json(responseBody);
  }
}
