import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TeamPermission } from '../../team/entites/team-permission.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('schedule')
export class Schedule {
  @ApiProperty({ description: '일정 ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '일정 이름' })
  @Column({ nullable: false, unique: true })
  name: string;

  @ApiProperty({ description: '일정 정보' })
  @Column({ nullable: false })
  description: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ApiProperty({ description: '팀 권한', type: () => TeamPermission })
  @ManyToOne(() => TeamPermission)
  @JoinColumn({ name: 'team_permission' })
  permission: TeamPermission;

  @ApiProperty({ description: '일정 마감일' })
  @Column({ nullable: false })
  deadline: Date;
}
