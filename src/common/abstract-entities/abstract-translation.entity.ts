import { Column } from 'typeorm';

import { LanguageCode } from '../../enums';
import { AbstractEntity } from './abstract.entity';

export interface IAbstractTranslationEntity {
  languageCode: LanguageCode;
}

export class AbstractTranslationEntity
  extends AbstractEntity
  implements IAbstractTranslationEntity
{
  @Column({ type: 'enum', enum: LanguageCode })
  languageCode!: LanguageCode;
}

export interface ITranslations<
  T extends AbstractTranslationEntity = AbstractTranslationEntity,
> {
  translations?: T[];
}

export class AbstractEntityWithTranslations<
    T extends AbstractTranslationEntity = AbstractTranslationEntity,
  >
  extends AbstractEntity
  implements ITranslations
{
  translations?: T[];
}
