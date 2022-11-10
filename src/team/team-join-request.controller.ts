import {
  Post,
  UseGuards,
  Param,
  Req,
  Delete,
  Controller,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiParam,
  ApiCookieAuth,
  ApiTags,
} from '@nestjs/swagger';
import { TeamInfoDto } from './dto/team-info.dto';
import { TeamService } from './team.service';

@ApiTags('Team Join Request')
@Controller('team/join')
export class TeamJoinRequestController {
  constructor(private readonly teamService: TeamService) {}

  @Post(':team_id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '팀 가입 요청 추가',
    description: '팀 가입 요청을 추가합니다.',
  })
  @ApiOkResponse({
    description: '성공적으로 팀 가입 요청이 추가됩니다.',
    type: TeamInfoDto,
  })
  @ApiBadRequestResponse({
    description:
      '팀이 존재하지 않거나 유저가 존재하지 않거나 유저가 팀이나 가입 요청에 존재한다면 발생합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 되어있지 않은 경우 발생합니다.',
  })
  @ApiParam({ name: 'team_id', required: true, description: '팀 UUID' })
  @ApiCookieAuth()
  async addJoinRequest(@Param('team_id') team_id: string, @Req() req) {
    const team = await this.teamService.addJoinRequest(team_id, req.user.id);
    return {
      team: {
        ...team,
        applicant: { ...team.applicant, id: undefined },
        permission: [...team.permission.user],
        schedule:
          team.schedule &&
          team.schedule.sort((o1, o2) => {
            return +o1.deadline > +o2.deadline ? 1 : -1;
          }),
      },
    };
  }

  @Delete(':team_id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '팀 가입 요청 제거',
    description: '팀 가입 요청을 제거합니다.',
  })
  @ApiOkResponse({
    description: '성공적으로 팀 가입 요청이 제거됩니다.',
    type: TeamInfoDto,
  })
  @ApiBadRequestResponse({
    description:
      '팀이 존재하지 않거나 유저가 존재하지 않거나 유저가 가입 요청에 존재하지 않는다면 발생합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 되어있지 않은 경우 발생합니다.',
  })
  @ApiParam({ name: 'team_id', required: true, description: '팀 UUID' })
  @ApiCookieAuth()
  async removeJoinRequest(@Param('team_id') team_id: string, @Req() req) {
    const team = await this.teamService.removeJoinRequest(team_id, req.user.id);
    return {
      team: {
        ...team,
        applicant: { ...team.applicant, id: undefined },
        permission: [...team.permission.user],
        schedule:
          team.schedule &&
          team.schedule.sort((o1, o2) => {
            return +o1.deadline > +o2.deadline ? 1 : -1;
          }),
      },
    };
  }
}
