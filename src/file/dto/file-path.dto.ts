import { ApiProperty } from '@nestjs/swagger';

export class FilePathDto {
  @ApiProperty({
    description: '파일 URL',
    example: 'URL',
  })
  path: string;
}
