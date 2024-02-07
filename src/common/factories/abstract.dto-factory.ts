import { type ClassConstructor, plainToClass } from 'class-transformer';

import { type AbstractEntity } from '../abstract-entities/abstract.entity';
import { type AbstractViewEntity } from '../abstract-entities/abstract.view-entity';
import { type AbstractDto } from '../dtos/abstract.dto';

export abstract class AbstractDtoFactory {
  protected createDto<
    Dto extends AbstractDto,
    P extends AbstractEntity | AbstractViewEntity | Record<string, unknown>,
  >(dtoClass: ClassConstructor<Dto>, plain: P): Dto {
    return plainToClass(dtoClass, plain, {
      excludeExtraneousValues: true,
    });
  }

  protected createDtoArray<
    Dto extends AbstractDto,
    P extends AbstractEntity | AbstractViewEntity | Record<string, unknown>,
  >(dtoClass: ClassConstructor<Dto>, plains: P[]): Dto[] {
    return plains.map((item) => this.createDto(dtoClass, item));
  }
}
