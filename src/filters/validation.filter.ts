import {
  type ArgumentsHost,
  Catch,
  HttpStatus,
  UnprocessableEntityException,
  type ValidationError,
} from '@nestjs/common';
import { ERROR_CODE } from 'common/exception/error-code';
import { snakeCase } from 'lodash';

import { BaseFilter, type IParseExceptionResult } from './base.filter';

export interface INormalizeError {
  property: string;
  children?: INormalizeError[];
  message?: string;
  constraint?: string;
}

@Catch(UnprocessableEntityException)
export class ValidationExceptionFilter extends BaseFilter {
  protected parseException(
    exception: UnprocessableEntityException,
    _host: ArgumentsHost,
  ): IParseExceptionResult & Record<string, unknown> {
    const { message: errors } = exception.getResponse() as {
      message: ValidationError[];
    };

    return {
      type: 'ValidationException',
      code: ERROR_CODE.VALIDATION_FAILED,
      message: 'Validation failed',
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: this.normalizeValidationErrors(errors),
    };
  }

  private normalizeValidationErrors(
    errors: ValidationError[],
  ): INormalizeError[] {
    return errors.map((err) => {
      const result: INormalizeError = {
        property: err.property,
      };

      if (err.children && err.children.length > 0) {
        result.children = this.normalizeValidationErrors(err.children);
      }

      const constraints = Object.entries(err.constraints ?? {});

      if (constraints.length > 0) {
        const [key, message] = constraints[0];
        result.constraint = `error.field.${snakeCase(key)}`;
        result.message = message;
      }

      return result;
    });
  }
}
