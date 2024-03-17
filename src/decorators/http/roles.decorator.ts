/* eslint-disable @typescript-eslint/naming-convention */
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';

export const Roles = Reflector.createDecorator<string[]>({ key: ROLES_KEY });
