import { type ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { ERROR_CODE } from 'exceptions/error-code';
import {
  I18nContext,
  type I18nValidationError,
  I18nValidationException,
} from 'nestjs-i18n';
import { formatI18nErrors } from 'nestjs-i18n/dist/utils';
import { ERROR_MESSAGE_KEY } from 'translation-keys';

import { BaseFilter, type IParseExceptionResult } from './base.filter';

export interface INormalizeError {
  property: string;
  children?: INormalizeError[];
  message?: string;
}

@Catch(I18nValidationException)
export class I18nValidationExceptionFilter extends BaseFilter {
  protected parseException(
    exception: I18nValidationException,
    _host: ArgumentsHost,
  ): IParseExceptionResult {
    const i18n = I18nContext.current()!;
    const errors = formatI18nErrors(exception.errors, i18n.service, {
      lang: i18n.lang,
    });

    return {
      errors: this.normalizeValidationErrors(errors),
      code: ERROR_CODE.VALIDATION_FAILED,
      messageKey: ERROR_MESSAGE_KEY.VALIDATION_FAILED,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      type: exception.name,
    };
  }

  private normalizeValidationErrors(
    errors: I18nValidationError[],
  ): INormalizeError[] {
    return errors.map((err) => {
      const result: INormalizeError = {
        property: err.property,
      };

      if (err.children && err.children.length > 0) {
        result.children = this.normalizeValidationErrors(err.children);
      }

      const constraints = Object.values(err.constraints ?? {});

      if (constraints.length > 0) {
        result.message = Object.values(constraints)[0];
      }

      return result;
    });
  }
}
