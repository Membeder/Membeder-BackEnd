import { CreateTeamDto } from './create-team.dto';
import { ApiProperty } from '@nestjs/swagger';
import { GetUserDto } from '../../user/dto/get-user.dto';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { GetTeamNoticeDto } from './get-team-notice.dto';

export class GetTeamDto extends CreateTeamDto {
  @ApiProperty({
    description: 'UUID',
    example: '6cbd505e-3ca6-11ed-a261-0242ac120002',
  })
  id: string;

  @ApiProperty({ description: '팀 공개 여부' })
  private: boolean;

  @ApiProperty({ description: '팀장', type: () => GetUserDto })
  owner: GetUserDto;

  @ApiProperty({
    description: '팀원',
    type: () => [GetUserDto],
    example: [],
    required: false,
  })
  member: GetUserDto[];

  @ApiProperty({
    description: '권한 팀원',
    type: () => [GetUserDto],
    example: [],
    required: false,
  })
  permission: GetUserDto[];

  @ApiProperty({
    description: '팀 일정',
    type: () => [Schedule],
    example: [],
    required: false,
  })
  schedule: Schedule[];

  @ApiProperty({
    description: '팀 참가 요청',
    type: () => [GetUserDto],
    example: [],
    required: false,
  })
  join_request: GetUserDto[];

  @ApiProperty({
    description: '팀 공지',
    type: () => [GetTeamNoticeDto],
    example: [],
    required: false,
  })
  notice: GetTeamNoticeDto[];

  @ApiProperty({ description: '팀 생성일' })
  created: Date;

  @ApiProperty({ description: '팀 마지막 수정일' })
  updated: Date;
}
