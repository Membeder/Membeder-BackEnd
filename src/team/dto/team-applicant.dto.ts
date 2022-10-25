import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class TeamApplicantDto {
  @ApiProperty({ description: '개발자' })
  @IsNumber()
  developer: number;

  @ApiProperty({ description: '디자이너' })
  @IsNumber()
  designer: number;

  @ApiProperty({ description: '기획자' })
  @IsNumber()
  director: number;
}
