import { type ITranslationOptions } from 'definitions/interfaces';

export const STATIC_TRANSLATION_DECORATOR_KEY = 'custom:static-translate';
export const DYNAMIC_TRANSLATION_DECORATOR_KEY = 'custom:dynamic-translate';

export function StaticTranslate(
  data: ITranslationOptions = {},
): PropertyDecorator {
  return (target, key) => {
    Reflect.defineMetadata(STATIC_TRANSLATION_DECORATOR_KEY, data, target, key);
  };
}

export function DynamicTranslate(): PropertyDecorator {
  return (target, key) => {
    Reflect.defineMetadata(DYNAMIC_TRANSLATION_DECORATOR_KEY, {}, target, key);
  };
}
