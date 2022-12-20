import { ApiProperty } from '@nestjs/swagger';
import { GetUserDto } from '../../user/dto/get-user.dto';

export class GetPortfolioDto {
  @ApiProperty({ description: 'UUID' })
  id: string;

  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '유저' })
  user: GetUserDto;

  @ApiProperty({ description: '파일 링크' })
  file: string;

  @ApiProperty({ description: '생성일', type: () => Date })
  created: Date;
}
