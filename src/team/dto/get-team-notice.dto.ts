import { CreateTeamNoticeDto } from './create-team-notice.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetTeamNoticeDto extends CreateTeamNoticeDto {
  @ApiProperty({ description: 'UUID' })
  id: string;

  @ApiProperty({ description: '공지 생성일' })
  created: Date;
}
