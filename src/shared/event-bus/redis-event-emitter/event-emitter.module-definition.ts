import { ConfigurableModuleBuilder } from '@nestjs/common';
import { type Redis } from 'ioredis';

export interface IRedisEventEmitterOptions {
  pubClient: Redis;
  subClient: Redis;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<IRedisEventEmitterOptions>()
    .setClassMethodName('forRoot')
    .setExtras(
      {
        isGlobal: true,
      },
      (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
      }),
    )
    .build();
