import * as ClassTransformer from 'class-transformer';
import { type Constructor } from 'definitions/@types';
import { type IParseOptions, parse } from 'qs';

export interface ITransformOptions {
  strategy?: 'excludeAll' | 'exposeAll';
  excludeExtraneousValues?: boolean;
  exposeUnsetFields?: boolean;
}

export function plainToClass<T, V>(
  Class: Constructor<T>,
  plain: V | V[],
  options?: ITransformOptions,
) {
  return ClassTransformer.plainToClass(Class, plain, options);
}

export function parseQueryStringToObject<TClass extends Constructor>(
  value: unknown,
  options?: IParseOptions & { fallback?: unknown; getClass?: () => TClass },
) {
  if (typeof value !== 'string') {
    return value;
  }

  try {
    const parseValue = parse(value, options);

    if (options?.getClass) {
      const classValue = options.getClass();

      return plainToClass(classValue, parseValue) as TClass;
    }

    return parseValue;
  } catch {
    return options?.fallback;
  }
}
