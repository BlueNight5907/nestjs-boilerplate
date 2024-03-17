import { Injectable } from '@nestjs/common';
import { STATIC_TRANSLATION_DECORATOR_KEY } from 'decorators/translate';
import { type ITranslationOptions as DefTranslationOptions } from 'definitions/interfaces';
import { isArray, isString, map } from 'lodash';
import { I18nService } from 'nestjs-i18n';

import { AbstractDto } from '../../../common/dtos/abstract.dto';
import { ContextProvider } from '../../../providers';
import {
  type ITranslateOptions,
  type ITranslationService,
} from './ITranslationService';

@Injectable()
export class TranslationService implements ITranslationService {
  constructor(private readonly i18n: I18nService) {}

  async translate(key: string, options?: ITranslateOptions): Promise<string> {
    return this.i18n.translate(`${key}`, {
      lang: ContextProvider.getLanguage(),
      ...options,
    });
  }

  async translateNecessaryKeys<T extends AbstractDto>(dto: T): Promise<T> {
    await Promise.all(
      map(dto, async (value: unknown, key) => {
        if (isString(value)) {
          const translateDec: DefTranslationOptions | undefined =
            Reflect.getMetadata(STATIC_TRANSLATION_DECORATOR_KEY, dto, key);

          if (translateDec) {
            return this.translate(
              `${translateDec.translationKey ?? key}.${value}`,
            );
          }

          return;
        }

        if (value instanceof AbstractDto) {
          return this.translateNecessaryKeys(value);
        }

        if (isArray(value)) {
          return Promise.all(
            map(value, (v) => {
              if (v instanceof AbstractDto) {
                return this.translateNecessaryKeys(v);
              }
            }),
          );
        }
      }),
    );

    return dto;
  }
}
