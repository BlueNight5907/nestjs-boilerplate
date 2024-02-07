import { Body, Controller, Post, UploadedFiles } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  BooleanField,
  BooleanFieldOptional,
  ClassField,
  EmailField,
  EmailFieldOptional,
  EnumField,
  EnumFieldOptional,
  NumberField,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
} from 'decorators/field';
import { UploadFiles } from 'decorators/http';
import {
  ApiExceptionDecorator,
  ApiLanguageDecorator,
} from 'decorators/swagger';
import { Order } from 'enums';
import { FileNotFoundException, SaveFileException } from 'exceptions/file';
import { type IFile } from 'interfaces';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ParseFilePipe } from 'pipes/parse-file';
import { FilesValidator } from 'pipes/parse-file/validators';

class TestChild {
  @StringFieldOptional()
  name?: string;

  @NumberFieldOptional()
  age?: number;

  @BooleanFieldOptional()
  male?: boolean;

  @EmailFieldOptional()
  email?: string;

  @EnumFieldOptional(() => Order)
  order?: Order;
}

class TestDto {
  @StringField({ each: true })
  name: string[];

  @NumberField()
  age: number;

  @BooleanField()
  male: boolean;

  @EmailField()
  email: string;

  @EnumField(() => Order)
  order: Order;

  @ClassField(() => TestChild, { nullable: true })
  child: TestChild;
}

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  @Post()
  @ApiLanguageDecorator({ from: 'query' })
  @UploadFiles([{ name: 'file2' }], { isRequired: true })
  @ApiExceptionDecorator({
    exception: new FileNotFoundException('sample'),
    status: 400,
    descriptions: 'File not found',
  })
  @ApiExceptionDecorator({
    exception: new SaveFileException('sample'),
    status: 400,
    descriptions: 'File not found',
  })
  test(
    @I18n() i18n: I18nContext,
    @UploadedFiles(
      new ParseFilePipe(
        new FilesValidator({
          fileIsRequired: true,
          fileTypes: ['jpg', 'png'],
          maxFileSize: 1024 * 1024 * 1024,
        }),
      ),
    )
    files: IFile[],
  ) {
    console.info(files);

    return {
      trans: i18n.t('admin.keywords.admin'),
      files: files.length,
    };
  }

  @Post('/test')
  @ApiLanguageDecorator({ from: 'query' })
  test2(@Body() body: TestDto) {
    return {
      body,
    };
  }
}
