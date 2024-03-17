import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { type IGeneratorService } from './IGeneratorService';

@Injectable()
export class GeneratorService implements IGeneratorService {
  public uuid(): string {
    return uuid();
  }

  public fileName(ext: string): string {
    return this.uuid() + '.' + ext;
  }
}
