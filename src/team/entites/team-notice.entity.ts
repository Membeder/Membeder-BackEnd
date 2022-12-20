import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('team_notice')
export class TeamNotice {
  @ApiProperty({ description: 'UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '공지 제목' })
  @Column({ nullable: false })
  title: string;

  @ApiProperty({ description: '공지 내용' })
  @Column({ nullable: false })
  content: string;

  @ApiProperty({ description: '공지 생성일' })
  @CreateDateColumn()
  created: Date;
}
