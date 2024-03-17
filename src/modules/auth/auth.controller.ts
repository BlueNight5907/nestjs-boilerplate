import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
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
import { Order } from 'definitions/enums';
import { type IFile } from 'definitions/interfaces';
import { I18n, I18nContext } from 'nestjs-i18n';
import { ParseFilePipe } from 'pipes/parse-file';
import { FileIsRequiredException } from 'pipes/parse-file/exceptions';
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
  @StringField({ each: true, maxLength: 5 })
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
  child?: TestChild;
}

@Controller('auth')
@ApiTags('auth')
export class AuthController {
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

  @Get('test2')
  @SkipThrottle()
  test3() {
    throw new FileIsRequiredException('sample');
  }
}
