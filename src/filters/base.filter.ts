import { type ArgumentsHost, type ExceptionFilter } from '@nestjs/common';
import { type Request, type Response } from 'express';
import { type IExceptionResponse } from 'interfaces';
import { type ITranslationService } from 'shared/interfaces';

export interface IParseExceptionResult extends Record<string, unknown> {
  code: number;
  status: number;
  messageKey: string;
  type: string;
  args?: Record<string, unknown>;
}

export abstract class BaseFilter implements ExceptionFilter {
  constructor(protected readonly translationService: ITranslationService) {}

  protected abstract parseException(
    exception: unknown,
    host: ArgumentsHost,
  ): IParseExceptionResult;

  private buildResponseBody(
    data: {
      message: string;
      path: string;
      url: string;
      code: number;
      type: string;
      method: string;
    } & Record<string, unknown>,
  ): IExceptionResponse {
    return {
      ...data,
      timestamp: new Date(),
    };
  }

  protected getTranslationPrefix() {
    return 'exception';
  }

  async catch(exception: unknown, host: ArgumentsHost) {
    const request: Request = host.switchToHttp().getRequest();
    const response: Response = host.switchToHttp().getResponse();

    const url = `${request.protocol}://${request.get('host')}${
      request.originalUrl
    }`;

    const method = request.method;

    const { code, messageKey, status, args, type, ...others } =
      this.parseException(exception, host);

    const message = await this.translationService.translate(
      `${this.getTranslationPrefix()}.${messageKey}`,
      {
        defaultValue: messageKey,
        args,
      },
    );

    const responseBody = this.buildResponseBody({
      message,
      url,
      code,
      type,
      method,
      path: request.path,
      ...others,
    });

    response.status(status).json(responseBody);
  }
}
