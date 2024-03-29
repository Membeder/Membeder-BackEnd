import {
  IsDate,
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
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    description: 'Account Type',
    example: 'email',
    required: true,
  })
  @IsIn(['google', 'email'])
  type: 'google' | 'email';

  @ApiProperty({
    description: '이름',
    example: '홍길동',
    required: true,
    minimum: 2,
    maximum: 4,
  })
  @IsString()
  @Length(2, 4)
  name: string;

  @ApiProperty({
    description: '닉네임',
    example: '나는야홍길동',
    required: true,
    minimum: 3,
    maximum: 8,
  })
  @IsString()
  @Validate(Unique, [User])
  @Length(3, 8)
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
    description: '프로필 사진',
    example: 'URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  picture: string;

  @ApiProperty({
    description: '생년월일',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birth: Date;

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
    required: false,
  })
  @IsOptional()
  @IsString()
  profession: string;

  @ApiProperty({
    description: '경력',
    example: 3,
    required: false,
  })
  @IsOptional()
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
    example: '안녕하세요 저는 백엔드 개발을 하고 있는 홍길동이라고 합니다.',
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
