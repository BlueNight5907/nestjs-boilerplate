import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { StrategyType } from 'definitions/enums';
import { Strategy } from 'passport';

@Injectable()
export class PublicStrategy extends PassportStrategy(
  Strategy,
  StrategyType.PUBLIC,
) {
  constructor() {
    super();
  }

  authenticate(): void {
    return this.success({ [Symbol.for('isPublic')]: true });
  }
}
