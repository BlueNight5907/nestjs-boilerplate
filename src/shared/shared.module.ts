import { Global, Module, type Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import {
  FILE_SYSTEM_SERVICE,
  GENERATOR_SERVICE,
  PARSE_PAGE_OPTIONS_SERVICE,
  TRANSLATION_SERVICE,
  VALIDATOR_SERVICE,
} from './provider-token';
import { FileSystemService, ParsePageOptionsService } from './services';
import { ApiConfigService } from './services/api-config.service';
import { AwsS3Service } from './services/aws-s3.service';
import { GeneratorService } from './services/generator.service';
import { TranslationService } from './services/translation.service';
import { ValidatorService } from './services/validator.service';

const providers: Provider[] = [
  ApiConfigService,
  AwsS3Service,
  {
    provide: GENERATOR_SERVICE,
    useClass: GeneratorService,
  },
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
  {
    provide: PARSE_PAGE_OPTIONS_SERVICE,
    useClass: ParsePageOptionsService,
  },
];

@Global()
@Module({
  providers,
  imports: [CqrsModule],
  exports: [...providers, CqrsModule],
})
export class SharedModule {}
