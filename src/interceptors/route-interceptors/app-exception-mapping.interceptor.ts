import {
  type CallHandler,
  type ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { BaseException } from 'common/exception';
import { type Constructor } from 'definitions/@types';
import { catchError } from 'rxjs/operators';

export type DomainToHttpMapping = Array<{
  httpStatus: HttpStatus;
  exceptionClassList: Array<Constructor<BaseException>>;
}>;

@Injectable()
export class AppExceptionMappingInterceptor implements NestInterceptor {
  constructor(private readonly mapping: DomainToHttpMapping) {}

  public intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((error: Error) => {
        if (!(error instanceof BaseException)) {
          throw error;
        }

        for (const { httpStatus, exceptionClassList } of this.mapping) {
          for (const exceptionClass of exceptionClassList) {
            if (error instanceof exceptionClass) {
              throw new HttpException(error, httpStatus);
            }
          }
        }

        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }),
    );
  }
}
