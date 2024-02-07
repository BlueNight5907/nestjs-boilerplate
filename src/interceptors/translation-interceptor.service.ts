import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { type Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ITranslationService } from 'shared/interfaces';

import { type AbstractDto } from '../common/dtos/abstract.dto';

// FIXME: add implementation
@Injectable()
export class TranslationInterceptor implements NestInterceptor {
  constructor(private readonly translationService: ITranslationService) {}

  public intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<AbstractDto> {
    return next
      .handle()
      .pipe(
        mergeMap((data: AbstractDto) =>
          this.translationService.translateNecessaryKeys<AbstractDto>(data),
        ),
      );
  }
}
