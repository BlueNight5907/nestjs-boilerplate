import {
  type ClassConstructor,
  plainToClass,
  plainToInstance,
} from 'class-transformer';
import { type AbstractEntity } from 'common/abstract-entities/abstract.entity';
import { type AbstractDto } from 'common/dtos/abstract.dto';

export abstract class AbstractEntityFactory {
  protected createEntity<E extends AbstractEntity, P extends AbstractDto>(
    entity: ClassConstructor<E>,
    plain: P,
  ): E {
    return plainToClass(entity, plain, {
      excludeExtraneousValues: true,
    });
  }

  protected createEntityArray<E extends AbstractEntity, P extends AbstractDto>(
    entity: ClassConstructor<E>,
    plains: P[],
  ): E[] {
    return plainToInstance(entity, plains, { excludeExtraneousValues: true });
  }
}
