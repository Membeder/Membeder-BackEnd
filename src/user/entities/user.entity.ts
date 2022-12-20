import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Team } from '../../team/entites/team.entity';
import { ChatRoom } from 'src/chat/entities/chat-room.entity';

@Entity('user')
export class User {
  @ApiProperty({ description: 'UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Account Type' })
  @Column({ nullable: false })
  type: 'google' | 'email';

  @ApiProperty({ description: '이름' })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({ description: '닉네임' })
  @Column({ nullable: false, unique: true })
  nickname: string;

  @ApiProperty({ description: '이메일' })
  @Column({ nullable: false, unique: true })
  email: string;

  @ApiProperty({ description: '비밀번호' })
  @Column({ nullable: true, select: false })
  password: string;

  @ApiProperty({ description: '생년월일', required: false })
  @Column({ nullable: true })
  birth: Date;

  @ApiProperty({ description: '프로필 사진', required: false })
  @Column({ nullable: true })
  picture: string;

  @ApiProperty({ description: '직종', required: false })
  @Column({ nullable: true })
  profession: string;

  @ApiProperty({ description: '경력', required: false })
  @Column({ nullable: true })
  career: number;

  @ApiProperty({ description: '웹사이트', required: false })
  @Column({ default: '' })
  website: string;

  @ApiProperty({ description: '한줄 소개', required: false })
  @Column({ default: '' })
  introduce: string;

  @ApiProperty({ description: '기술 스택', required: false })
  @Column({ default: '' })
  stack: string;

  @ApiProperty({ description: '분야', required: false })
  @Column({ default: '' })
  department: string;

  @ApiProperty({ description: '팀 목록', type: () => [Team], example: [] })
  @ManyToMany(() => Team)
  @JoinTable({ name: 'user_team' })
  team: Team[];

  @ApiProperty({
    description: '채팅방 목록',
    type: () => [ChatRoom],
    example: [],
  })
  @ManyToMany(() => ChatRoom)
  @JoinTable({ name: 'user_chat' })
  chat: ChatRoom[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
