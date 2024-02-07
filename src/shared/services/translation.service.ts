import { Injectable } from '@nestjs/common';
import { STATIC_TRANSLATION_DECORATOR_KEY } from 'decorators/translate';
import { isArray, isString, map } from 'lodash';
import { I18nService } from 'nestjs-i18n';
import {
  type ITranslateOptions,
  type ITranslationService,
} from 'shared/interfaces';

import { AbstractDto } from '../../common/dtos/abstract.dto';
import { type ITranslationOptions } from '../../interfaces';
import { ContextProvider } from '../../providers';

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
          const translateDec = Reflect.getMetadata(
            STATIC_TRANSLATION_DECORATOR_KEY,
            dto,
            key,
          ) as ITranslationOptions | undefined;

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
