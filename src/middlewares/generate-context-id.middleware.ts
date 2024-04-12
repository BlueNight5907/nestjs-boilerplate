import { Injectable, type NestMiddleware } from '@nestjs/common';
import { type Uuid } from 'definitions/@types';
import { type NextFunction, type Request, type Response } from 'express';
import { ContextProvider } from 'providers';
import { v4 } from 'uuid';

@Injectable()
export class GenerateContextIdMiddleware implements NestMiddleware {
  use(_req: Request, _res: Response, next: NextFunction) {
    const id = v4();
    ContextProvider.setCurrentContextId(id as Uuid);
    next();
  }
}
