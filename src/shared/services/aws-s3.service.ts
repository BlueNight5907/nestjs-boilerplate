import { S3 } from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { extension } from 'mime-types';
import { IGeneratorService } from 'shared/interfaces';
import { GENERATOR_SERVICE } from 'shared/provider-token';

import { type IFile } from '../../interfaces';
import { ApiConfigService } from './api-config.service';

@Injectable()
export class AwsS3Service {
  private readonly s3: S3;

  constructor(
    public configService: ApiConfigService,
    @Inject(GENERATOR_SERVICE)
    public generatorService: IGeneratorService,
  ) {
    const awsS3Config = configService.awsS3Config;

    this.s3 = new S3({
      apiVersion: awsS3Config.bucketApiVersion,
      region: awsS3Config.bucketRegion,
    });
  }

  async uploadImage(file: IFile): Promise<string> {
    const fileName = this.generatorService.fileName(
      <string>extension(file.mimetype),
    );
    const key = 'images/' + fileName;
    await this.s3.putObject({
      Bucket: this.configService.awsS3Config.bucketName,
      Body: file.buffer,
      ACL: 'public-read',
      Key: key,
    });

    return key;
  }
}
