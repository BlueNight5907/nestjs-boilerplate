import {
  type CallHandler,
  type ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { BaseException } from 'common/exception';
import { type Uuid } from 'definitions/@types';
import { type Request } from 'express';
import { type JwtPayloadDto } from 'modules/auth/dtos';
import { ContextProvider } from 'providers';
import { tap } from 'rxjs/operators';
import { WINSTON_AUDIT_LOGGER_SERVICE } from 'shared/logger';
import {
  type IAuditLogData,
  IAuditLoggerService,
} from 'shared/logger/core/interfaces';

interface IParseErrorData {
  message: string;
  type: string;
  stack?: string;
  cause?: string;
  [key: string]: unknown;
}

interface IParseExceptionStrategy {
  parse(exception: unknown): IParseErrorData;
}

class ParseAppExceptionStrategy implements IParseExceptionStrategy {
  parse(exception: BaseException): IParseErrorData {
    return {
      ...exception,
      message: exception.message,
      type: exception.constructor.name,
      cause: JSON.stringify(exception.cause),
      stack: exception.stack,
    };
  }
}

class ParseHttpExceptionStrategy implements IParseExceptionStrategy {
  parse(exception: HttpException): IParseErrorData {
    const response = exception.getResponse();
    const type = exception.name;
    const metaData = typeof response === 'string' ? undefined : response;

    return {
      message: typeof response === 'string' ? response : type,
      type,
      cause: JSON.stringify(exception.cause),
      stack: exception.stack,
      httpStatus: exception.getStatus(),
      metaData,
    };
  }
}

class ParseOtherExceptionStrategy implements IParseExceptionStrategy {
  parse(exception: Error): IParseErrorData {
    return {
      message: exception.message,
      type: exception.constructor.name,
      stack: exception.stack,
      cause: JSON.stringify(exception.cause),
    };
  }
}

@Injectable()
export class HttpAuditLogInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_AUDIT_LOGGER_SERVICE)
    private readonly loggerService: IAuditLoggerService,
  ) {}

  private getMetaInfo(
    context: ExecutionContext,
  ): Omit<
    IAuditLogData,
    'status' | 'httpStatus' | 'content' | 'cause' | 'stack' | 'app'
  > {
    const request: Request = context.switchToHttp().getRequest();
    const contextId = ContextProvider.getCurrentContextId() as Uuid;
    const url = `${request.protocol}://${request.get('host')}${
      request.originalUrl
    }`;
    const user = (request.user ?? {}) as JwtPayloadDto;
    const userId = user.userId ? (user.userId as Uuid) : 'None';
    const ipAddress = request.ips.length > 0 ? request.ips[0] : request.ip;
    const method = request.method;

    return {
      contextId,
      url,
      userId,
      ipAddress,
      method,
    };
  }

  private handleResponseSuccessful(
    context: ExecutionContext,
    data: Record<string, any>,
  ) {
    const metaInfo = this.getMetaInfo(context);

    const logData: IAuditLogData = {
      ...metaInfo,
      status: 'success',
      httpStatus: HttpStatus.OK,
      content: {
        data,
      },
    };

    this.loggerService.log(
      `${metaInfo.ipAddress} - - OUTGOING RESPONSE - ${metaInfo.method} - "${metaInfo.url}" - SUCCESS`,
      logData,
    );
  }

  private handleError(context: ExecutionContext, error: Error) {
    const metaInfo = this.getMetaInfo(context);

    let parser: IParseExceptionStrategy;

    if (error instanceof BaseException) {
      parser = new ParseAppExceptionStrategy();
    } else if (error instanceof HttpException) {
      parser = new ParseHttpExceptionStrategy();
    } else {
      parser = new ParseOtherExceptionStrategy();
    }

    const errorData = parser.parse(error);

    const logData: IAuditLogData = {
      ...metaInfo,
      status: 'error',
      content: { errorData },
    };

    this.loggerService.log(
      `${metaInfo.ipAddress} - - OUTGOING RESPONSE - ${metaInfo.method} - "${metaInfo.url}" - ERROR: ${errorData.message}`,
      logData,
    );
  }

  public intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      tap({
        next: (data: Record<string, any>) => {
          this.handleResponseSuccessful(context, data);
        },
        error: (err: Error) => {
          this.handleError(context, err);
        },
      }),
    );
  }
}
