import { UserInfoDto } from './user-info.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserInfoTokenDto extends UserInfoDto {
  @ApiProperty({ description: '유저 Access Token' })
  accessToken: string;
}
