import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Team } from '../../team/entites/team.entity';
import { IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: '팀 목록',
    required: false,
    type: () => [Team],
  })
  @IsOptional()
  team: Team[];
}
