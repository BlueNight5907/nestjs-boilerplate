import { Global, Module, type Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { FileSystemService, ParsePageOptionsService } from './common';
import { ApiConfigService } from './common/api-config/api-config.service';
import { AwsS3Service } from './common/aws-s3.service';
import { GeneratorService } from './common/generator/generator.service';
import { TranslationService } from './common/translation/translation.service';
import { ValidatorService } from './common/validator.service';
import {
  FILE_SYSTEM_SERVICE,
  GENERATOR_SERVICE,
  PARSE_PAGE_OPTIONS_SERVICE,
  TRANSLATION_SERVICE,
  VALIDATOR_SERVICE,
} from './provider-tokens';

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
