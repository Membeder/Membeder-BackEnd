import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Chat } from './chat.entity';

@Entity('chat_room')
export class ChatRoom {
  @ApiProperty({ description: 'UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '채팅방 이름' })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({ description: '채팅방 인원', type: () => [User], example: [] })
  @ManyToMany(() => User)
  @JoinTable({ name: 'char_room_member' })
  member: User[];

  @ApiProperty({ description: '채팅방 채팅', type: () => [Chat], example: [] })
  @ManyToMany(() => Chat)
  @JoinTable({ name: 'char_room_chat' })
  chat: Chat[];

  @ApiProperty({ description: '채팅방 개설일' })
  @CreateDateColumn()
  created: Date;

  @ApiProperty({ description: '마지막 채팅 날짜' })
  @UpdateDateColumn()
  updated: Date;
}
