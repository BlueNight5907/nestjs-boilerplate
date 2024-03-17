import path from 'node:path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { seconds, ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from 'database/database.module';
import { ThrottlerBehindProxyGuard } from 'guards';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';

import { AuthModule } from './modules/auth/auth.module';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { ApiConfigService } from './shared/common/api-config/api-config.service';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${
        process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''
      }`,
    }),
    DatabaseModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ApiConfigService) => ({
        fallbackLanguage: configService.fallbackLanguage,
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: configService.isDevelopment,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        { use: HeaderResolver, options: ['x-lang'] },
        AcceptLanguageResolver,
      ],
      imports: [SharedModule],
      inject: [ApiConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [SharedModule],
      inject: [ApiConfigService],
      useFactory: (config: ApiConfigService) => ({
        throttlers: [
          {
            ttl: seconds(config.appConfig.throttleTTL),
            limit: config.appConfig.requestLimit,
            ignoreUserAgents: [
              new RegExp('googlebot', 'gi'),
              new RegExp('bingbot', 'gi'),
            ],
          },
        ],
      }),
    }),
    HealthCheckerModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule {}
