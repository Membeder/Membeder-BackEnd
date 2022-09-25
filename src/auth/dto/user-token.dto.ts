import { ApiProperty } from '@nestjs/swagger';

export class UserTokenDto {
  @ApiProperty({ description: '유저 Access Token' })
  accessToken: string;
}
