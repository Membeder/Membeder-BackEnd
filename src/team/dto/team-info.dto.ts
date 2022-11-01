import { ApiProperty } from '@nestjs/swagger';
import { GetTeamDto } from './get-team.dto';

export class TeamInfoDto {
  @ApiProperty()
  team: GetTeamDto;
}
