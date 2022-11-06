import { TeamPermissionService } from './dto/team-permission.service';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TeamInfoDto } from './dto/team-info.dto';

@ApiTags('Team Permission')
@Controller('team/permission')
export class TeamPermissionController {
  constructor(private readonly teamPermissionService: TeamPermissionService) {}

  @Post('/:team_id/:user_id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '팀원 권한 추가',
    description: '팀원에게 권한을 추가합니다.',
  })
  @ApiOkResponse({
    description: '성공적으로 팀원 권한이 추가됩니다.',
    type: TeamInfoDto,
  })
  @ApiBadRequestResponse({
    description:
      '팀이 존재하지 않거나 유저가 존재하지 않거나 유저가 팀에 존재하지 않거나 유저가 권한이 이미 있는 경우 발생합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 되어있지 않은 경우 발생합니다.',
  })
  @ApiForbiddenResponse({ description: '팀장이 아닌 경우 발생합니다.' })
  @ApiParam({ name: 'team_id', required: true, description: '팀 UUID' })
  @ApiParam({ name: 'user_id', required: true, description: '유저 UUID' })
  @ApiCookieAuth()
  async addUser(
    @Param('team_id') team_id: string,
    @Param('user_id') user_id: string,
    @Req() req,
  ) {
    const team = await this.teamPermissionService.addUser(
      team_id,
      user_id,
      req.user.id,
    );
    return {
      team: {
        ...team,
        applicant: { ...team.applicant, id: undefined },
        permission: [...team.permission.user],
      },
    };
  }

  @Delete('/:team_id/:user_id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '팀원 권한 제거',
    description: '팀원에게 권한을 제거합니다.',
  })
  @ApiOkResponse({
    description: '성공적으로 팀원 권한이 제거됩니다.',
    type: TeamInfoDto,
  })
  @ApiBadRequestResponse({
    description:
      '팀이 존재하지 않거나 유저가 존재하지 않거나 유저가 팀에 존재하지 않거나 유저가 권한이 없는 경우 발생합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 되어있지 않은 경우 발생합니다.',
  })
  @ApiForbiddenResponse({ description: '팀장이 아닌 경우 발생합니다.' })
  @ApiParam({ name: 'team_id', required: true, description: '팀 UUID' })
  @ApiParam({ name: 'user_id', required: true, description: '유저 UUID' })
  @ApiCookieAuth()
  async remove(
    @Param('team_id') team_id: string,
    @Param('user_id') user_id: string,
    @Req() req,
  ) {
    const team = await this.teamPermissionService.removeUser(
      team_id,
      user_id,
      req.user.id,
    );
    return {
      team: {
        ...team,
        applicant: { ...team.applicant, id: undefined },
        permission: [...team.permission.user],
      },
    };
  }
}
