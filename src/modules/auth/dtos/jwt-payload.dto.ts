import { type RoleType, type TokenType } from 'definitions/enums';

export class JwtPayloadDto {
  userId: string;

  role: RoleType;

  type: TokenType;
}
