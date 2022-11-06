import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilePathDto } from './dto/file-path.dto';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '파일 업로드',
    description: '파일을 업로드합니다.',
  })
  @ApiOkResponse({
    description: '파일이 성공적으로 업로드 되었습니다.',
    type: FilePathDto,
  })
  @ApiBadRequestResponse({ description: '파일이 존재하지 않을 때 발생합니다.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.MulterS3.File) {
    return this.fileService.upload(file);
  }
}
