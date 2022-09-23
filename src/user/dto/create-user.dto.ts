import {
  IsEmail,
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
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Account Type',
    example: 'email',
    required: true,
  })
  @IsString()
  type: 'google' | 'email';

  @ApiProperty({
    description: '이름',
    example: '윤도현',
    required: true,
  })
  @IsString()
  @Length(2, 4)
  name: string;

  @ApiProperty({
    description: '닉네임',
    example: '윤도현',
    required: true,
  })
  @IsString()
  @Validate(Unique, [User])
  @Length(3, 16)
  nickname: string;

  @ApiProperty({
    description: '이메일',
    example: 'test@gmail.com',
    required: true,
  })
  @IsEmail()
  @Validate(Unique, [User])
  email: string;

  @ApiProperty({
    description: '비밀번호',
    example: '12345678',
    required: true,
  })
  @IsString()
  @IsOptional()
  @Length(8, 24)
  password: string;

  @ApiProperty({
    description: '직종',
    example: '개발자',
    required: true,
  })
  @IsString()
  profession: string;

  @ApiProperty({
    description: '경력',
    example: 3,
    required: true,
  })
  @IsInt()
  career: number;

  @ApiProperty({
    description: '웹사이트',
    example: 'https://github.com/F1N2',
    required: false,
  })
  @IsOptional()
  @IsString()
  @ValidateIf((object, value) => {
    return /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
  })
  website: string;

  @ApiProperty({
    description: '한줄 소개',
    example: '안녕하세요 저는 백엔드 개발을 하고 있는 윤도현이라고 합니다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  introduce: string;

  @ApiProperty({
    description: '기술 스택',
    example: 'NestJS, Express, TypeScript, NodeJS',
    required: false,
  })
  @IsOptional()
  @IsString()
  stack: string;

  @ApiProperty({
    description: '분야',
    example: '백엔드',
    required: false,
  })
  @IsOptional()
  @IsString()
  department: string;
}
