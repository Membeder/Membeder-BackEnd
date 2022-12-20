import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Req,
  Get,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
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
import { GetChatRoomDto } from './dto/get-chat-room.dto';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/:room_id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'room_id',
    required: true,
    description: '채팅방 UUID',
  })
  @ApiOperation({
    summary: '채팅방 정보 가져오기',
    description: '채팅방 정보를 가져옵니다.',
  })
  @ApiOkResponse({
    description: '채팅방 정보를 가져왔습니다.',
    type: GetChatRoomDto,
  })
  @ApiCookieAuth()
  async get(@Param('room_id') room_id: string, @Req() req) {
    return await this.chatService.get(room_id, req.user.id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '채팅방 추가', description: '채팅방을 추가합니다.' })
  @ApiOkResponse({
    description: '채팅방이 추가되었습니다.',
    type: GetChatRoomDto,
  })
  @ApiCookieAuth()
  async createRoom(@Req() req, @Body() data: CreateChatRoomDto) {
    return await this.chatService.createRoom(req.user.id, data);
  }

  @Post('/:room_id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'room_id',
    required: true,
    description: '채팅방 UUID',
  })
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
    @Param('room_id') id: string,
    @Req() req,
  ) {
    return await this.chatService.create(id, req.user.id, data);
  }

  @Delete('/:room_id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'room_id',
    required: true,
    description: '채팅방 UUID',
  })
  @ApiOperation({
    summary: '채팅방 제거',
    description: '채팅방을 제거합니다.',
  })
  @ApiOkResponse({ description: '채팅방을 성공적으로 제거합니다.' })
  async removeRoom(@Param('room_id') room_id: string, @Req() req, @Res() res) {
    await this.chatService.removeRoom(room_id, req.user.id);
    res.sendStatus(HttpStatus.OK);
  }

  @Post('/:room_id/:user_id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'room_id',
    required: true,
    description: '채팅방 UUID',
  })
  @ApiParam({
    name: 'user_id',
    required: true,
    description: '유저 UUID',
  })
  @ApiOperation({
    summary: '채팅방 유저 추가',
    description: '채팅방에 유저를 추가합니다.',
  })
  @ApiOkResponse({
    description: '채팅방에 유저를 성공적으로 추가합니다.',
    type: GetChatRoomDto,
  })
  @ApiCookieAuth()
  async addUser(
    @Param('room_id') room_id: string,
    @Param('user_id') user_id: string,
    @Req() req,
  ) {
    return await this.chatService.addUser(room_id, req.user.id, user_id);
  }

  @Delete('/:room_id/:user_id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'room_id',
    required: true,
    description: '채팅방 UUID',
  })
  @ApiParam({
    name: 'user_id',
    required: true,
    description: '유저 UUID',
  })
  @ApiOperation({
    summary: '채팅방 유저 제거',
    description: '채팅방에 유저를 제거합니다.',
  })
  @ApiOkResponse({
    description: '채팅방에 유저를 성공적으로 제거합니다.',
    type: GetChatRoomDto,
  })
  @ApiCookieAuth()
  async removeUser(
    @Param('room_id') room_id: string,
    @Param('user_id') user_id: string,
    @Req() req,
  ) {
    return await this.chatService.removeUser(room_id, req.user.id, user_id);
  }
}
