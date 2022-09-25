import { ApiProperty } from '@nestjs/swagger';

export class GoogleProfileDto {
  @ApiProperty({ description: '이름', example: '홍길동' })
  name: string;

  @ApiProperty({ description: 'First Name', example: '홍' })
  family_name: string;

  @ApiProperty({ description: 'Last Name', example: '길동' })
  given_name: string;

  @ApiProperty({ description: '구글 프로필 사진', example: 'URL' })
  picture: string;

  @ApiProperty({ description: '구글 이메일', example: 'test@gmail.com' })
  email: string;

  @ApiProperty({ description: '이메일 인증 여부', example: true })
  email_verified: boolean;

  @ApiProperty({ description: '국가', example: 'ko' })
  locale: string;

  @ApiProperty({ description: '가입 여부', example: false })
  registered: boolean;

  @ApiProperty({ description: 'Access Token', required: false })
  accessToken?: string;
}
