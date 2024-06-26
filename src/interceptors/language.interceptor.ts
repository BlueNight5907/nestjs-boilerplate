import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { LanguageCode } from 'definitions/enums';
import { I18nContext } from 'nestjs-i18n';
import { ContextProvider } from 'providers';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler) {
    const i18n = I18nContext.current();

    const language: string = i18n?.lang ?? '';

    if (LanguageCode[language]) {
      ContextProvider.setLanguage(language);
    }

    return next.handle();
  }
}
