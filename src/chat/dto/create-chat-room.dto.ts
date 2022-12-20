import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateChatRoomDto {
  @ApiProperty({ description: '채팅방 이름' })
  @IsString()
  name: string;
}
