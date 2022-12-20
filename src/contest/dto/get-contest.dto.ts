import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class GetContestDto {
  @ApiProperty({
    description: 'UUID',
    example: '6cbd505e-3ca6-11ed-a261-0242ac120002',
  })
  id: string;

  @ApiProperty({
    description: '대회 이름',
  })
  name: string;

  @ApiProperty({
    description: '대회 주최',
  })
  host: string;

  @ApiProperty({
    description: '대회 대상자',
    type: String,
    isArray: true,
  })
  target: string[];

  @ApiProperty({ description: '접수 마감일' })
  @IsDate()
  @Type(() => Date)
  receipt: Date;

  @ApiProperty({ description: '심사 마감일' })
  @IsDate()
  @Type(() => Date)
  judge: Date;

  @ApiProperty({
    description: '자세한 정보',
  })
  content: string;

  @ApiProperty({
    description: '대회 포스터',
  })
  poster: string;

  @ApiProperty({
    description: '대회 시상내역',
  })
  award: string;
}
