import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('team_permission')
export class TeamPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '팀원', type: () => [User], example: [] })
  @ManyToMany(() => User)
  @JoinTable({ name: 'team_permission_user' })
  user: User[];
}
