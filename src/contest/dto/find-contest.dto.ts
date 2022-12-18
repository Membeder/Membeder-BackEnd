import { IsIn, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class FindContestDto {
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sort?: 'ASC' | 'DESC';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  count?: number = 5;
}
