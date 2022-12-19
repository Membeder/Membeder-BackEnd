import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
  ) {}

  async create(room_id: string, user_id: string, data: CreateChatDto) {
    const room = await this.chatRoomRepository.findOne({
      where: { id: room_id },
    });
    if (!room)
      throw new HttpException('The room is not exist.', HttpStatus.BAD_REQUEST);
    if (!room.member.find((e) => e.id == user_id))
      throw new HttpException(
        'The User does not exist in this room.',
        HttpStatus.BAD_REQUEST,
      );
    const chat = await this.chatRepository.create(data);
    return await this.chatRepository.save(chat);
  }

  async createRoom(user_id: string, data: CreateChatRoomDto) {
    const room = await this.chatRoomRepository.create(data);
    return await this.chatRoomRepository.save(room);
  }

  async addUser(room_id: string, user_id: string) {}

  async removeUser(room_id: string, user_id: string) {}
}
