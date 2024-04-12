import { Global, Module, type Provider } from '@nestjs/common';

import { MemoryCacheModule, RedisCacheModule } from './caching';
import {
  ApiConfigService,
  AwsS3Service,
  FileSystemService,
  TranslationService,
  ValidatorService,
} from './common';
import { EventEmitterModule } from './event-bus';
import {
  InfraFactoryModule,
  IORedisFactory,
  NodeCacheFactory,
} from './infra-factories';
import { WinstonLoggerModule } from './logger';
import { BullMqModule } from './queue';
import {
  FILE_SYSTEM_SERVICE,
  TRANSLATION_SERVICE,
  VALIDATOR_SERVICE,
} from './tokens';

const providers: Provider[] = [
  ApiConfigService,
  AwsS3Service,
  {
    provide: VALIDATOR_SERVICE,
    useClass: ValidatorService,
  },

  {
    provide: TRANSLATION_SERVICE,
    useClass: TranslationService,
  },
  {
    provide: FILE_SYSTEM_SERVICE,
    useClass: FileSystemService,
  },
];

@Global()
@Module({
  providers,
  imports: [
    WinstonLoggerModule,
    InfraFactoryModule,
    BullMqModule.forRootAsync({
      useFactory: (factory: IORedisFactory) => ({
        connection: factory.getClient(),
      }),
      inject: [IORedisFactory],
    }),
    RedisCacheModule.forRootAsync({
      useFactory: (factory: IORedisFactory) => factory.getClient(),
      inject: [IORedisFactory],
    }),
    MemoryCacheModule.forRootAsync({
      useFactory: (factory: NodeCacheFactory) => factory.getCacheStore(),
      inject: [NodeCacheFactory],
    }),
    EventEmitterModule.forRootAsync({
      useFactory: (factory: IORedisFactory) => ({
        pubClient: factory.getClient(),
        subClient: factory.createNewClient({}),
      }),
      inject: [IORedisFactory],
    }),
  ],
  exports: [
    ...providers,
    WinstonLoggerModule,
    MemoryCacheModule,
    RedisCacheModule,
    BullMqModule,
    EventEmitterModule,
    InfraFactoryModule,
  ],
})
export class SharedModule {}
