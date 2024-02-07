import { type AbstractDto } from 'common/dtos/abstract.dto';

export interface ITranslateOptions {
  lang?: string;
  args?: Record<string, any>;
  defaultValue?: string;
}
export interface ITranslationService {
  translate(key: string, options?: ITranslateOptions): Promise<string>;
  translateNecessaryKeys<T extends AbstractDto>(dto: T): Promise<T>;
}
