import { QueueEventsListener } from '@nestjs/bullmq';
import {
  Body,
  Controller,
  Inject,
  NotFoundException,
  Post,
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  BooleanField,
  EmailField,
  EnumField,
  NumberField,
  StringField,
} from 'decorators/field';
import { AuditLogDecorator, UploadFiles } from 'decorators/http';
import {
  ApiExceptionDecorator,
  ApiLanguageDecorator,
} from 'decorators/swagger';
import { Order } from 'definitions/enums';
import { type IFile } from 'definitions/interfaces';
import { I18n, I18nContext } from 'nestjs-i18n';
import {
  FileIsRequiredException,
  FilesValidator,
  ParseFilePipe,
} from 'pipes/parse-file';
import { ICacheManager, InjectMemoryCache } from 'shared/caching';
import { IEventEmitter, REDIS_EE2_EVENT_EMITTER } from 'shared/event-bus';
import { WINSTON_LOGGER_SERVICE } from 'shared/logger';
import { ILoggerService } from 'shared/logger/core/interfaces';
import { InjectQueue, IQueue } from 'shared/queue';

import { TestEvent } from './events/test.event';

class TestDto {
  @StringField({ each: true, maxLength: 5 })
  name: string[];

  @NumberField()
  age: number;

  @BooleanField()
  male: boolean;

  @EmailField({ example: 'a@a.com' })
  email: string;

  @EnumField(() => Order)
  order: Order;
}

@Controller('auth')
@ApiTags('auth')
@QueueEventsListener('test')
export class AuthController {
  constructor(
    @Inject(WINSTON_LOGGER_SERVICE)
    private readonly loggerService: ILoggerService,
    @Inject(REDIS_EE2_EVENT_EMITTER)
    private readonly eventEmitter: IEventEmitter,
    @InjectQueue('test') private readonly queue: IQueue,
    @InjectMemoryCache('abc')
    private readonly memoryCacheManager: ICacheManager,
  ) {
    this.loggerService.setContext(AuthController.name);
  }

  @Post()
  @ApiLanguageDecorator({ from: 'query' })
  @UploadFiles([{ name: 'sample', isArray: true }], { isRequired: true })
  @ApiExceptionDecorator(
    {
      exception: new FileIsRequiredException('sample'),
      status: 400,
      descriptions: 'File is Required',
    },
    {
      exception: new NotFoundException('abc'),
      status: 400,
      descriptions: 'File not found',
      code: 'aaa',
      type: 'abc',
    },
  )
  test(
    @I18n() i18n: I18nContext,
    @UploadedFiles(
      new ParseFilePipe(
        new FilesValidator({
          fileIsRequired: true,
          fileTypes: ['jpg', 'png', 'jpeg'],
          maxFileSize: 1024 * 1024 * 1024,
          field: 'sample',
        }),
      ),
    )
    files: IFile[],
  ) {
    return {
      trans: i18n.t('admin.keywords.admin'),
      files: files.length,
    };
  }

  @Post('/test')
  @ApiLanguageDecorator({ from: 'query' })
  @AuditLogDecorator()
  async test1(@Body() body: TestDto) {
    await this.eventEmitter.emit(new TestEvent('send from 3000'));

    this.queue
      .add<TestDto, string>('hello', body)
      .then(async (job) => console.info(await job.waitUntilFinished()))
      .catch((error) => console.error(error));

    console.info(await this.memoryCacheManager.get<TestDto>('test2'), 'cache');

    await this.memoryCacheManager.set('test2', body);

    return { body };
  }
}
