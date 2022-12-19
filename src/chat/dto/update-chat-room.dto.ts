import { CreateChatRoomDto } from './create-chat-room.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateChatRoomDto extends PartialType(CreateChatRoomDto) {}
