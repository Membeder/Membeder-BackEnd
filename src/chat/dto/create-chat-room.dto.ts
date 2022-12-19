import { ApiProperty } from '@nestjs/swagger';

export class CreateChatRoomDto {
  @ApiProperty({ description: '채팅방 이름' })
  name: string;
}
