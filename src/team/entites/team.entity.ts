import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

@Entity('team')
export class Team {
  @ApiProperty({ description: 'UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '팀명' })
  @Column({ nullable: false, unique: true })
  name: string;

  @ApiProperty({ description: '팀 공개 여부', required: false })
  @Column({ default: false })
  private: boolean;

  @ApiProperty({ description: '팀 이미지', required: false })
  @Column({ nullable: true })
  image: string;

  @ApiProperty({ description: '팀장', type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: Promise<User>;

  @ApiProperty({ description: '팀원', type: () => [User], example: [] })
  @ManyToMany(() => User)
  @JoinTable({ name: 'team_member' })
  member: Promise<User[]>;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
