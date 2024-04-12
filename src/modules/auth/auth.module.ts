import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { StrategyType } from 'definitions/enums';
import { MemoryCacheModule } from 'shared/caching';
import { ApiConfigService } from 'shared/common/api-config';
import { EventEmitterModule } from 'shared/event-bus';
import { BullMqModule } from 'shared/queue';

import { AuthConsumer } from './auth.consumer';
import { AuthController } from './auth.controller';
import { AuthListener } from './auth.listener';
import { AuthService } from './auth.service';
import { TestEvent } from './events/test.event';
import { JwtStrategy, PublicStrategy } from './strategies';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: StrategyType.JWT }),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        privateKey: configService.authConfig.privateKey,
        publicKey: configService.authConfig.publicKey,
        signOptions: {
          algorithm: 'RS256',
          expiresIn: configService.authConfig.jwtExpirationTime,
        },
        verifyOptions: {
          algorithms: ['RS256'],
        },
      }),
      inject: [ApiConfigService],
    }),
    EventEmitterModule.registerEvents([TestEvent.publishableEventName]),
    BullMqModule.registerQueue({ name: 'test' }),
    MemoryCacheModule.registerCacheManager({ name: 'abc' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    PublicStrategy,
    AuthListener,
    AuthConsumer,
  ],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
