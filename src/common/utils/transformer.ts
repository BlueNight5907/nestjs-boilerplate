import * as ClassTransformer from 'class-transformer';
import { type Constructor } from 'definitions/@types';

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
