import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { type Uuid } from 'definitions/@types';
import { type RoleType, TokenType } from 'definitions/enums';
import { ApiConfigService } from 'shared/common';

import { TokenPayloadDto } from './dtos/token-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
  ) {}

  async createAccessToken(data: {
    role: RoleType;
    userId: Uuid;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
        role: data.role,
      }),
    });
  }
}
