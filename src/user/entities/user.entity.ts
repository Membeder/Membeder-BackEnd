import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user')
export class User {
  @ApiProperty({ description: 'UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  @Column({ nullable: false })
  password: string;

  @ApiProperty({ description: '직종' })
  @Column({ nullable: false })
  profession: string;

  @ApiProperty({ description: '경력' })
  @Column({ nullable: false })
  career: number;

  @ApiProperty({ description: '웹사이트' })
  @Column({ default: '' })
  website: string;

  @ApiProperty({ description: '한줄 소개' })
  @Column({ default: '' })
  introduce: string;

  @ApiProperty({ description: '기술 스택' })
  @Column({ default: '' })
  stack: string;

  @ApiProperty({ description: '분야' })
  @Column({ default: '' })
  department: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
