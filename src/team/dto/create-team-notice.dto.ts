import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamNoticeDto {
  @ApiProperty({ description: '공지 제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '공지 내용' })
  @IsString()
  content: string;
}
