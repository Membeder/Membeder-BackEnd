import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AvailavleUserDto {
  @ApiProperty({ description: '이메일', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: '닉네임', required: false })
  @IsOptional()
  @IsString()
  nickname?: string;
}
