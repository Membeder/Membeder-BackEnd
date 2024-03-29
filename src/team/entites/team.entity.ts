import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { TeamApplicant } from './team-applicant.entity';
import { TeamPermission } from './team-permission.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { TeamNotice } from './team-notice.entity';
import { ChatRoom } from '../../chat/entities/chat-room.entity';

@Entity('team')
export class Team {
  @ApiProperty({ description: 'UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '팀명' })
  @Column({ nullable: false, unique: true })
  name: string;

  @ApiProperty({ description: '팀 설명' })
  @Column({ nullable: false })
  description: string;

  @ApiProperty({ description: '팀 공개 여부', required: false })
  @Column({ default: false })
  private: boolean;

  @ApiProperty({ description: '팀 이미지', required: false })
  @Column({ nullable: true })
  image: string;

  @ApiProperty({ description: '팀 배너', required: false })
  @Column({ nullable: true })
  banner: string;

  @ApiProperty({ description: '팀장', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @ApiProperty({ description: '팀원', type: () => [User], example: [] })
  @ManyToMany(() => User)
  @JoinTable({ name: 'team_member' })
  member: User[];

  @ApiProperty({ description: '팀 권한', type: () => TeamPermission })
  @ManyToOne(() => TeamPermission)
  @JoinColumn({ name: 'team_permission' })
  permission: TeamPermission;

  @ApiProperty({ description: '팀 일정', type: () => [Schedule], example: [] })
  @ManyToMany(() => Schedule)
  @JoinTable({ name: 'team_schedule' })
  schedule: Schedule[];

  @ApiProperty({ description: '모집 인원', type: () => TeamApplicant })
  @ManyToOne(() => TeamApplicant)
  @JoinColumn({ name: 'applicant_id' })
  applicant: TeamApplicant;

  @ApiProperty({ description: '팀 가입 요청', type: () => [User], example: [] })
  @ManyToMany(() => User)
  @JoinTable({ name: 'team_join_request' })
  join_request: User[];

  @ApiProperty({
    description: '팀 공지',
    type: () => [TeamNotice],
    example: [],
  })
  @ManyToMany(() => TeamNotice)
  @JoinTable({ name: 'team_notice_list' })
  notice: TeamNotice[];

  @ApiProperty({
    description: '팀 채팅방',
    type: () => ChatRoom,
    example: [],
  })
  @ManyToOne(() => ChatRoom)
  @JoinTable({ name: 'team_notice_list' })
  chat: ChatRoom;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
