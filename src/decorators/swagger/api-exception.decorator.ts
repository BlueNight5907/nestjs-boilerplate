/* eslint-disable @typescript-eslint/naming-convention */
import { applyDecorators, HttpException } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { BaseException } from 'common/exception/BaseException';
import { type IExceptionResponse } from 'definitions/interfaces';
import { v4 } from 'uuid';

interface IAppExceptionOptions {
  status: number | 'default' | '1XX' | '2XX' | '3XX' | '4XX' | '5XX';
  descriptions?: string;
  exception: BaseException;
}

interface ICommonHttpExceptionOptions {
  status: number | 'default' | '1XX' | '2XX' | '3XX' | '4XX' | '5XX';
  descriptions?: string;
  exception: HttpException;
  code: string;
  type: string;
}

interface IParseExceptionResult {
  title: string;
  content: {
    description?: string;
    value: IExceptionResponse;
  };
}

type ApiExceptionItem = IAppExceptionOptions | ICommonHttpExceptionOptions;

type Status = number | 'default' | '1XX' | '2XX' | '3XX' | '4XX' | '5XX';

function exceptionToJson(data: ApiExceptionItem): IParseExceptionResult {
  let body: IExceptionResponse = {} as IExceptionResponse;

  if (data.exception instanceof HttpException) {
    data = data as ICommonHttpExceptionOptions;
    body = {
      id: v4(),
      message: data.exception.message,
      code: data.code,
      type: data.type,
      url: '{protocol}://{full_url}',
      path: '/path/to/something',
      method: 'GET, POST, PUT, PATCH, DELETE',
      timestamp: new Date(),
    };
  }

  if (data.exception instanceof BaseException) {
    body = {
      id: v4(),
      message: data.exception.message,
      code: data.exception.code,
      type: data.exception.constructor.name,
      args: data.exception.args,
      url: '{protocol}://{full_url}',
      path: '/path/to/something',
      method: 'GET, POST, PUT, PATCH, DELETE',
      timestamp: new Date(),
    };
  }

  return {
    content: { description: data.descriptions, value: body },
    title: body.type,
  };
}

export function ApiExceptionDecorator(...list: ApiExceptionItem[]) {
  const decorators: Array<MethodDecorator & ClassDecorator> = [];
  const mapByStatus: Record<Status, ApiExceptionItem[] | undefined> =
    {} as Record<Status, ApiExceptionItem[]>;

  for (const options of list) {
    const mapValue = mapByStatus[options.status];

    if (mapValue) {
      mapValue.push(options);
      continue;
    }

    mapByStatus[options.status] = [options];
  }

  for (const [status, optionsList] of Object.entries(mapByStatus)) {
    const schemas: Record<
      string,
      {
        description?: string;
        value: any;
      }
    > = {};

    for (const options of optionsList!) {
      const parseValue = exceptionToJson(options);
      schemas[parseValue.title] = parseValue.content;
    }

    decorators.push(
      ApiResponse({
        status: status as Status,
        content: {
          'application/json': {
            examples: schemas,
          },
        },
      }),
    );
  }

  return applyDecorators(...decorators);
}
