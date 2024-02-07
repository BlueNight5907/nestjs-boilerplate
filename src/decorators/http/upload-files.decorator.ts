import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { type MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiConsumes } from '@nestjs/swagger';
import { ApiFileDecorator, RegisterModels } from 'decorators/swagger';
import _ from 'lodash';

export interface IFileUploadOptions {
  name: string;
  isArray?: boolean;
  maxCount?: number;
}

export function UploadFiles(
  files: _.Many<IFileUploadOptions>,
  options: Partial<{ isRequired: boolean; localOptions: MulterOptions }> = {},
): MethodDecorator {
  const filesArray = _.castArray(files);
  let apiFileInterceptor: MethodDecorator & ClassDecorator;

  if (filesArray.length === 1) {
    const file = filesArray[0];
    apiFileInterceptor =
      file.isArray || (file.maxCount && file.maxCount > 1)
        ? UseInterceptors(
            FilesInterceptor(file.name, file.maxCount, options.localOptions),
          )
        : UseInterceptors(FileInterceptor(file.name, options.localOptions));
  } else {
    apiFileInterceptor = UseInterceptors(
      FileFieldsInterceptor(
        filesArray.map((file) => ({
          name: file.name,
          maxCount: file.maxCount,
        })),
        options.localOptions,
      ),
    );
  }

  return applyDecorators(
    RegisterModels(),
    ApiConsumes('multipart/form-data'),
    ApiFileDecorator(
      filesArray.map((file) => ({
        name: file.name,
        isArray: file.isArray || Number(file.maxCount) > 1,
      })),
      options,
    ),
    apiFileInterceptor,
  );
}
