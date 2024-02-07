/* eslint-disable @typescript-eslint/ban-types */
import { ApiExtraModels } from '@nestjs/swagger';

import { explore } from './swagger.helper';

export function RegisterModels(): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const body = explore<Function | undefined>(target, propertyKey);

    return (
      body &&
      (ApiExtraModels(body)(
        target,
        propertyKey,
        descriptor,
      ) as TypedPropertyDescriptor<any>)
    );
  };
}
