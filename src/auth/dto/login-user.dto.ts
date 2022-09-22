import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: '이메일',
    example: 'test@gmail.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '비밀번호',
    example: '12345678',
    required: true,
  })
  @IsString()
  @Length(8, 24)
  password: string;
}
