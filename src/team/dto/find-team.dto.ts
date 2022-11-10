import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FindTeamDto {
  @ApiProperty({ description: '정렬', required: false })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sort?: 'ASC' | 'DESC' = 'ASC';

  @ApiProperty({ description: 'ID', required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: '이름', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '분야', required: false })
  @IsOptional()
  @IsIn(['developer', 'designer', 'director'])
  applicant?: 'developer' | 'designer' | 'director';

  @ApiProperty({ description: '페이지', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @ApiProperty({ description: '개수', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  count?: number = 10;
}
