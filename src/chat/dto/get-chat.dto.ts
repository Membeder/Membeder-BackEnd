import { ApiProperty } from '@nestjs/swagger';
import { CreateChatDto } from './create-chat.dto';
import { GetChatRoomDto } from './get-chat-room.dto';
import { GetUserDto } from 'src/user/dto/get-user.dto';

export class GetChatDto extends CreateChatDto {
  @ApiProperty({ description: 'UUID' })
  id: string;

  @ApiProperty({ description: '채팅 유저', type: () => GetUserDto })
  user: GetUserDto;

  @ApiProperty({ description: '채팅 내용' })
  content: string;

  @ApiProperty({ description: '채팅방', type: () => GetChatRoomDto })
  room: GetChatRoomDto;

  @ApiProperty({ description: '채팅 날짜' })
  created: Date;
}
