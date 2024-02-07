import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { type BaseError } from 'common/BaseError';

export function ApiExceptionDecorator(
  ...list: Array<{
    status: number | 'default' | '1XX' | '2XX' | '3XX' | '4XX' | '5XX';
    descriptions?: string;
    exception: BaseError;
  }>
) {
  const decorators: Array<MethodDecorator & ClassDecorator> = [];

  for (const options of list) {
    decorators.push(
      ApiResponse({
        status: options.status,
        description: options.descriptions,
        schema: {
          properties: {
            message: {
              type: 'number',
              example: options.exception.message,
            },

            code: {
              type: 'number',
              example: options.exception.code,
            },
            args: { type: 'object', example: options.exception.args },
            type: {
              type: 'string',
              example: options.exception.constructor.name,
            },
            url: {
              type: 'string',
              example: '{protocol}://{full_url}',
            },
            path: {
              type: 'string',
              example: '/path/to/something',
            },
            method: {
              type: 'string',
              example: 'GET',
              description: 'GET, POST, PUT, PATCH, DELETE',
            },
            timestamp: {
              type: 'Date',
              example: new Date().toISOString(),
            },
          },
        },
      }),
    );
  }

  return applyDecorators(...decorators);
}
