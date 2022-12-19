import { ApiProperty } from '@nestjs/swagger';
import { CreateChatDto } from './create-chat.dto';
import { User } from '../../user/entities/user.entity';

export class GetChatDto extends CreateChatDto {
  @ApiProperty({ description: 'UUID' })
  id: string;

  @ApiProperty({ description: '채팅 유저', type: () => User })
  user: User;

  @ApiProperty({ description: '채팅 날짜' })
  created: Date;
}
