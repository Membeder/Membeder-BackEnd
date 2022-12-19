import { IsIn, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FindContestDto {
  @ApiProperty({
    description: '정렬',
    example: 'ASC',
    required: false,
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sort?: 'ASC' | 'DESC';

  @ApiProperty({
    description: '페이지',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @ApiProperty({
    description: '갯수',
    example: 5,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  count?: number = 5;
}
