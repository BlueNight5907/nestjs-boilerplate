import { applyDecorators, type Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PageDto } from 'common/dtos';

export function ApiPageOkResponse<
  T extends Type | 'string' | 'number' | 'boolean' | 'symbol',
>(options: { type: T; description?: string }): MethodDecorator {
  let type = 'object';

  const ref: { $ref?: string } = {};

  if (typeof options.type === 'string') {
    type = options.type;
  } else {
    ref.$ref = getSchemaPath(options.type);
  }

  const extractModels: Array<
    MethodDecorator | ClassDecorator | PropertyDecorator
  > = [];

  if (options.type instanceof Function) {
    extractModels.push(ApiExtraModels(options.type));
  }

  return applyDecorators(
    ApiExtraModels(PageDto),
    ...extractModels,
    ApiOkResponse({
      description: options.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: {
                  ...ref,
                  type,
                },
              },
            },
          },
        ],
      },
    }),
  );
}
