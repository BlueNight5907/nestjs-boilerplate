import {
  type ArgumentMetadata,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import { IFileValidator } from 'pipes/parse-file/validators';

@Injectable()
export class ParseFilePipe implements PipeTransform {
  constructor(private readonly validator?: IFileValidator) {}

  transform(files: unknown, _metadata: ArgumentMetadata) {
    if (!this.validator) {
      return files;
    }

    this.validator.validate(files);

    return files;
  }
}
