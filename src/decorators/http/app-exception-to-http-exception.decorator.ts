import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  AppExceptionMappingInterceptor,
  type DomainToHttpMapping,
} from 'interceptors';

export function AppExceptionToHttpException(mapping: DomainToHttpMapping) {
  return applyDecorators(
    UseInterceptors(new AppExceptionMappingInterceptor(mapping)),
  );
}
