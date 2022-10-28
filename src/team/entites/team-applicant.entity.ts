import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('team_applicant')
export class TeamApplicant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '개발자 모집 인원', required: false })
  @Column({ default: 0 })
  developer: number;

  @ApiProperty({ description: '디자이너 모집 인원', required: false })
  @Column({ default: 0 })
  designer: number;

  @ApiProperty({ description: '기획자 모집 인원', required: false })
  @Column({ default: 0 })
  director: number;
}
