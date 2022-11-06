import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService) {}

  upload(file: Express.MulterS3.File) {
    if (!file)
      throw new HttpException('The file is not exist.', HttpStatus.BAD_REQUEST);
    return {
      path: file.location.replace(
        `.${this.configService.get('AWS_S3_NAME')}`,
        '',
      ),
    };
  }
}
