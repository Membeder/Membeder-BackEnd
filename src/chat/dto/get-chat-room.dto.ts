import { CreateChatRoomDto } from './create-chat-room.dto';
import { ApiProperty } from '@nestjs/swagger';
import { GetUserDto } from 'src/user/dto/get-user.dto';
import { GetChatDto } from './get-chat.dto';

export class GetChatRoomDto extends CreateChatRoomDto {
  @ApiProperty({ description: '채팅방 주인', type: () => GetUserDto })
  owner: GetUserDto;

  @ApiProperty({
    description: '채팅방 인원',
    type: () => [GetUserDto],
    example: [],
  })
  member: GetUserDto[];

  @ApiProperty({
    description: '채팅방 채팅',
    type: () => [GetChatDto],
    example: [],
  })
  chat: GetChatDto[];

  @ApiProperty({ description: '채팅방 개설일' })
  created: Date;

  @ApiProperty({ description: '마지막 채팅 날짜' })
  updated: Date;
}
