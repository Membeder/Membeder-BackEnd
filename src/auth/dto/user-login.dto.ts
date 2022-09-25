import { ApiProperty } from '@nestjs/swagger';
import { GetUserDto } from '../../user/dto/get-user.dto';

export class UserLoginDto extends GetUserDto {
  @ApiProperty({ description: '유저 Access Token' })
  accessToken: string;
}
