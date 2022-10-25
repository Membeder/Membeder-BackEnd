import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Validate } from 'class-validator';
import { Unique } from 'typeorm';
import { Team } from '../entites/team.entity';

export class CreateTeamDto {
  @ApiProperty({ description: '팀명', example: 'Membeder', required: true })
  @Validate(Unique, [Team])
  @IsString()
  name: string;

  @ApiProperty({ description: '팀 공개 여부', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  private: boolean;

  @ApiProperty({ description: '팀 이미지', example: 'URL', required: false })
  @IsOptional()
  @IsString()
  image: string;
}
