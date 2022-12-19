import { Controller, Post, Body, UseGuards, Param, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetChatDto } from './dto/get-chat.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/:chat_room_id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'chat_room_id',
    required: true,
    description: '채팅방 UUID',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '채팅 추가',
    description: '채팅방에 채팅을 추가합니다.',
  })
  @ApiOkResponse({
    description: '채팅방에 채팅을 추가합니다.',
    type: GetChatDto,
  })
  @ApiCookieAuth()
  async create(
    @Body() data: CreateChatDto,
    @Param('chat_room_id') id: string,
    @Req() req,
  ) {
    return await this.chatService.create(id, req.user.id, data);
  }
}
