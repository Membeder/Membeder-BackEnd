import { IsDate, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateScheduleDto {
  @ApiProperty({ description: '일정 이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '일정 정보' })
  @IsString()
  description: string;

  @ApiProperty({ description: '생년월일' })
  @IsDate()
  @Type(() => Date)
  deadline: Date;
}
