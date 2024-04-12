import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { type Uuid } from 'definitions/@types';
import { type RoleType, StrategyType, TokenType } from 'definitions/enums';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ApiConfigService } from 'shared/common/api-config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, StrategyType.JWT) {
  constructor(configService: ApiConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.publicKey,
    });
  }

  validate(args: { userId: Uuid; role: RoleType; type: TokenType }): boolean {
    return !(args.type !== TokenType.ACCESS_TOKEN);
  }
}
