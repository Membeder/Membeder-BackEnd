import { CreateScheduleDto } from './create-schedule.dto';
import { ApiProperty } from '@nestjs/swagger';
import { GetUserDto } from '../../user/dto/get-user.dto';

export class GetScheduleDto extends CreateScheduleDto {
  @ApiProperty({
    description: 'UUID',
    example: '6cbd505e-3ca6-11ed-a261-0242ac120002',
  })
  id: string;

  @ApiProperty({
    description: '권한 팀원',
    type: () => [GetUserDto],
    example: [],
    required: false,
  })
  permission: GetUserDto[];

  @ApiProperty({ description: '일정 생성일' })
  created: Date;

  @ApiProperty({ description: '일정 마지막 수정일' })
  updated: Date;
}
