import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import path from 'path';

export const multerOptionsFactory = (
  configService: ConfigService,
): MulterOptions => {
  const s3 = new S3Client({
    region: configService.get('AWS_S3_REGION'),
    credentials: {
      accessKeyId: configService.get('AWS_S3_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_S3_SECRET_ACCESS_KEY'),
    },
  });

  return {
    storage: multerS3({
      s3,
      bucket: configService.get('AWS_S3_NAME'),
      key(_req, file, done) {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        done(null, `${basename}_${Date.now()}${ext}`);
      },
    }),
    limits: { fileSize: configService.get<number>('AWS_S3_FILE_SIZE_LIMIT') },
  };
};
