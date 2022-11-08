import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateScheduleDto {
  @ApiProperty({ description: '일정 이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '일정 정보' })
  @IsString()
  description: string;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  @ApiProperty({ description: '달성 여부', required: false, example: false })
  @IsOptional()
  @IsBoolean()
  complete: boolean = false;

  @ApiProperty({ description: '생년월일' })
  @IsDate()
  @Type(() => Date)
  deadline: Date;
}
