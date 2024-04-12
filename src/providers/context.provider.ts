import { type Uuid } from 'definitions/@types';
import { getValue, setValue } from 'express-ctx';

import { type LanguageCode } from '../definitions/enums';

export class ContextProvider {
  private static readonly nameSpace = 'request';

  private static readonly authUserKey = 'user_key';

  private static readonly languageKey = 'language_key';

  private static readonly currentContextIdKey = 'current_context_id_key';

  private static get<T>(key: string): T | undefined {
    return getValue<T>(ContextProvider.getKeyWithNamespace(key));
  }

  private static set<T>(key: string, value: T): void {
    setValue(ContextProvider.getKeyWithNamespace(key), value);
  }

  private static getKeyWithNamespace(key: string): string {
    return `${ContextProvider.nameSpace}.${key}`;
  }

  static setAuthUser(user: any): void {
    ContextProvider.set(ContextProvider.authUserKey, user);
  }

  static setLanguage(language: string): void {
    ContextProvider.set(ContextProvider.languageKey, language);
  }

  static getLanguage(): LanguageCode | undefined {
    return ContextProvider.get<LanguageCode>(ContextProvider.languageKey);
  }

  static getAuthUser(): any {
    return ContextProvider.get<any>(ContextProvider.authUserKey);
  }

  static setCurrentContextId(id: Uuid): void {
    ContextProvider.set(ContextProvider.currentContextIdKey, id);
  }

  static getCurrentContextId(): Uuid | undefined {
    return ContextProvider.get<Uuid>(ContextProvider.currentContextIdKey);
  }
}
