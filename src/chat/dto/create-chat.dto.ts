import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({ description: '채팅 내용' })
  @IsString()
  content: string;
}
