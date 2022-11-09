import { ApiProperty } from '@nestjs/swagger';
import { GetTeamDto } from './get-team.dto';

export class TeamListDto {
  @ApiProperty({ description: '팀', type: () => [GetTeamDto], example: [] })
  team: GetTeamDto[];
}
