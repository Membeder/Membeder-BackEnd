import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class FindTeamDto {
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sort?: 'ASC' | 'DESC';

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(['developer', 'designer', 'director'])
  applicant?: 'developer' | 'designer' | 'director';

  @IsOptional()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsInt()
  count?: number;
}
