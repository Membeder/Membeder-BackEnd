import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { ChatRoom } from './chat-room.entity';

@Entity('chat')
export class Chat {
  @ApiProperty({ description: 'UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '채팅 유저', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'chat_user' })
  user: User;

  @ApiProperty({ description: '채팅 내용' })
  @Column({ nullable: false })
  content: string;

  @ApiProperty({ description: '채팅방', type: () => ChatRoom })
  @ManyToOne(() => ChatRoom)
  @JoinColumn({ name: 'chat_room' })
  room: ChatRoom;

  @ApiProperty({ description: '채팅 날짜' })
  @CreateDateColumn()
  created: Date;
}
