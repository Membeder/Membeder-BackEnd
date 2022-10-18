import { ApiProperty } from '@nestjs/swagger';
import { GetUserDto } from '../../user/dto/get-user.dto';

export class UserInfoDto {
  @ApiProperty()
  user: GetUserDto;
}
