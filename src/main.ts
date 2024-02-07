import { ClassSerializerInterceptor, HttpStatus } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  ExpressAdapter,
  type NestExpressApplication,
} from '@nestjs/platform-express';
import compression from 'compression';
import { middleware as expressCtx } from 'express-ctx';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { I18nValidationPipe } from 'nestjs-i18n';
import { type ITranslationService } from 'shared/interfaces';
import { TRANSLATION_SERVICE } from 'shared/provider-token';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from './app.module';
import {
  AppExceptionFilter,
  I18nValidationExceptionFilter,
  NotFoundExceptionFilter,
  QueryFailedFilter,
} from './filters';
import { LanguageInterceptor, TranslationInterceptor } from './interceptors';
import { setupSwagger } from './setup-swagger';
import { ApiConfigService } from './shared/services';
import { SharedModule } from './shared/shared.module';

export async function bootstrap(): Promise<NestExpressApplication> {
  initializeTransactionalContext();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );
  // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // app.enable('trust proxy');
  app.use(helmet());
  // use api as global prefix if you don't have subdomain
  app.setGlobalPrefix('/api');
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 100 requests per windowMs
    }),
  );
  app.use(compression());
  app.use(morgan('combined'));
  app.enableVersioning();

  const reflector = app.get(Reflector);

  const translationService = app
    .select(SharedModule)
    .get<ITranslationService>(TRANSLATION_SERVICE);

  app.useGlobalFilters(
    new NotFoundExceptionFilter(translationService),
    new I18nValidationExceptionFilter(translationService),
    new AppExceptionFilter(translationService),
    new QueryFailedFilter(reflector),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new LanguageInterceptor(),
    new TranslationInterceptor(translationService),
  );

  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      dismissDefaultMessages: true,
    }),
  );

  const configService = app.select(SharedModule).get(ApiConfigService);

  if (configService.documentationEnabled) {
    setupSwagger(app);
  }

  app.use(expressCtx);

  // Starts listening for shutdown hooks
  if (!configService.isDevelopment) {
    app.enableShutdownHooks();
  }

  const port = configService.appConfig.port;
  await app.listen(port);

  console.info(`server running on ${await app.getUrl()}`);

  return app;
}

void bootstrap();
