import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  ExpressAdapter,
  type NestExpressApplication,
} from '@nestjs/platform-express';
import compression from 'compression';
import { middleware as expressCtx } from 'express-ctx';
import helmet from 'helmet';
import morgan from 'morgan';
import { type ITranslationService } from 'shared/common/translation';
import { TRANSLATION_SERVICE } from 'shared/tokens';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from './app.module';
import {
  AllExceptionsFilter,
  HttpExceptionFilter,
  ValidationExceptionFilter,
} from './filters';
import { LanguageInterceptor, TranslationInterceptor } from './interceptors';
import { setupSwagger } from './setups';
import { ApiConfigService } from './shared/common';
import { SharedModule } from './shared/shared.module';

export async function bootstrap(): Promise<NestExpressApplication> {
  initializeTransactionalContext();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );

  const configService = app.select(SharedModule).get(ApiConfigService);

  // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // app.enable('trust proxy');
  app.use(helmet());
  // use api as global prefix if you don't have subdomain
  app.setGlobalPrefix('/api');

  app.use(compression());
  app.use(morgan('combined'));
  app.enableVersioning();

  const reflector = app.get(Reflector);

  const translationService = app
    .select(SharedModule)
    .get<ITranslationService>(TRANSLATION_SERVICE);

  app.useGlobalFilters(
    new AllExceptionsFilter(translationService),
    new HttpExceptionFilter(translationService),
    new ValidationExceptionFilter(translationService),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new LanguageInterceptor(),
    new TranslationInterceptor(translationService),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: false,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

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
