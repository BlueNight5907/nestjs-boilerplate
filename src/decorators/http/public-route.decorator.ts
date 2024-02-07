import { type CustomDecorator, SetMetadata } from '@nestjs/common';

export const PUBLIC_ROUTE_KEY = 'public_route';

export function PublicRoute(isPublic = false): CustomDecorator {
  return SetMetadata(PUBLIC_ROUTE_KEY, isPublic);
}
