import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { GetTeamDto } from '../../team/dto/get-team.dto';
import { GetChatRoomDto } from 'src/chat/dto/get-chat-room.dto';

export class GetUserDto extends CreateUserDto {
  @ApiProperty({
    description: 'UUID',
    example: '6cbd505e-3ca6-11ed-a261-0242ac120002',
  })
  id: string;

  @ApiProperty({
    description: '팀 목록',
    type: () => [GetTeamDto],
    example: [],
    required: false,
  })
  team: GetTeamDto[];

  @ApiProperty({
    description: '채팅방 목록',
    type: () => [GetChatRoomDto],
    example: [],
    required: false,
  })
  chat: GetChatRoomDto[];

  @ApiProperty({ description: '계정 생성일' })
  created: Date;

  @ApiProperty({ description: '계정 마지막 수정일' })
  updated: Date;
}
