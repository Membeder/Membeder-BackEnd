import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Validate,
  ValidateIf,
} from 'class-validator';
import { Unique } from 'typeorm';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @Length(2, 4)
  name: string;

  @IsString()
  @Validate(Unique, [User])
  @Length(3, 16)
  nickname: string;

  @IsEmail()
  @Validate(Unique, [User])
  email: string;

  @IsString()
  @Length(8, 24)
  password: string;

  @IsString()
  profession: string;

  @IsInt()
  career: number;

  @IsIn(['male', 'female'])
  gender: 'male' | 'female';

  @IsOptional()
  @IsString()
  @ValidateIf((object, value) => {
    return /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
  })
  website: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  introduce: string;

  @IsOptional()
  @IsString()
  stack: string;
}
