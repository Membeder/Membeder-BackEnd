import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class TeamApplicantDto {
  @ApiProperty({ description: '개발자', required: false })
  @IsOptional()
  @IsNumber()
  developer: number;

  @ApiProperty({ description: '디자이너', required: false })
  @IsOptional()
  @IsNumber()
  designer: number;

  @ApiProperty({ description: '기획자', required: false })
  @IsOptional()
  @IsNumber()
  director: number;
}
