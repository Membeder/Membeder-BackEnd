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

  async get(room_id: string, user_id: string) {
    const room = await this.chatRoomRepository.findOne({
      where: { id: room_id },
      relations: ['member'],
    });
    if (!room)
      throw new HttpException('The room is not exist.', HttpStatus.BAD_REQUEST);
    if (!room.member.find((e) => e.id == user_id))
      throw new HttpException(
        'The user is not in this room.',
        HttpStatus.BAD_REQUEST,
      );
    return await this.chatRoomRepository.findOne({
      where: { id: room_id },
      relations: ['owner', 'member', 'chat'],
    });
  }

  async create(room_id: string, user_id: string, data: CreateChatDto) {
    const room = await this.chatRoomRepository.findOne({
      where: { id: room_id },
      relations: ['member', 'chat'],
    });
    if (!room)
      throw new HttpException('The room is not exist.', HttpStatus.BAD_REQUEST);
    if (!room.member.find((e) => e.id == user_id))
      throw new HttpException(
        'The user does not exist in this room.',
        HttpStatus.BAD_REQUEST,
      );
    const chat = await this.chatRepository.create({ ...data, room });
    await this.chatRepository.save(chat);
    room.chat.push(chat);
    await this.chatRoomRepository.save(room);
    return chat;
  }

  async createRoom(user_id: string, data: CreateChatRoomDto) {
    const owner = await this.userRepository.findOne({
      where: { id: user_id },
      relations: ['chat'],
    });
    const room = await this.chatRoomRepository.create({
      ...data,
      owner,
      member: [owner],
    });
    await this.chatRoomRepository.save(room);
    owner.chat.push(room);
    await this.userRepository.save(owner);
    return room;
  }

  async removeRoom(room_id: string, user_id: string) {
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user)
      throw new HttpException('The User is not exist.', HttpStatus.BAD_REQUEST);
    const room = await this.chatRoomRepository.findOne({
      where: { id: room_id },
      relations: ['owner', 'member', 'chat'],
    });
    if (!room)
      throw new HttpException('The room is not exist.', HttpStatus.BAD_REQUEST);
    if (room.owner.id != user_id)
      throw new HttpException(
        'The user is not owner in this room.',
        HttpStatus.FORBIDDEN,
      );
    await this.chatRoomRepository.delete({ id: room_id });
  }

  async addUser(room_id: string, user_id: string, add_user_id: string) {
    const room = await this.chatRoomRepository.findOne({
      where: { id: room_id },
      relations: ['owner', 'member', 'chat'],
    });
    if (!room)
      throw new HttpException('The room is not exist.', HttpStatus.BAD_REQUEST);
    if (room.owner.id != user_id)
      throw new HttpException(
        'The user is not owner in this room.',
        HttpStatus.FORBIDDEN,
      );
    if (!room)
      throw new HttpException('The room is not exist.', HttpStatus.BAD_REQUEST);
    if (room.owner.id != user_id)
      throw new HttpException(
        'The user is not owner in this room.',
        HttpStatus.FORBIDDEN,
      );
    const user = await this.userRepository.findOne({
      where: { id: add_user_id },
      relations: ['chat'],
    });
    if (!user)
      throw new HttpException('The user is not exist.', HttpStatus.BAD_REQUEST);
    if (room.member.find((e) => e.id == add_user_id))
      throw new HttpException(
        'The user is already in this room.',
        HttpStatus.BAD_REQUEST,
      );
    room.member.push(user);
    await this.chatRoomRepository.save(room);
    user.chat.push(room);
    await this.userRepository.save(user);
    return room;
  }

  async removeUser(room_id: string, user_id: string, remove_user_id: string) {
    const room = await this.chatRoomRepository.findOne({
      where: { id: room_id },
      relations: ['owner', 'member', 'chat'],
    });
    if (!room)
      throw new HttpException('The room is not exist.', HttpStatus.BAD_REQUEST);
    if (room.owner.id != user_id && user_id != remove_user_id)
      throw new HttpException(
        'The user is not owner in this room.',
        HttpStatus.FORBIDDEN,
      );
    const user = await this.userRepository.findOne({
      where: { id: remove_user_id },
      relations: ['chat'],
    });
    if (!user)
      throw new HttpException('The user is not exist.', HttpStatus.BAD_REQUEST);
    if (!room.member.find((e) => e.id == remove_user_id))
      throw new HttpException(
        'The user is already not in this room.',
        HttpStatus.BAD_REQUEST,
      );
    user.chat.splice(
      user.chat.findIndex((e) => e.id == room_id),
      1,
    );
    await this.userRepository.save(user);
    room.member.splice(
      room.member.findIndex((e) => e.id == remove_user_id),
      1,
    );
    await this.chatRoomRepository.save(room);
    return room;
  }
}
