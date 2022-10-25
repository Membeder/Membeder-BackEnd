import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { GetTeamDto } from './dto/get-team.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '팀 조회',
    description: '팀 UUID를 이용하여 팀를 조회합니다.',
  })
  @ApiOkResponse({
    description: '팀 UUID를 이용하여 팀 정보를 출력합니다.',
    type: GetTeamDto,
  })
  @ApiBadRequestResponse({ description: '팀 정보가 없는 경우 발생합니다.' })
  @ApiParam({ name: 'id', required: true, description: '팀 UUID' })
  @ApiCookieAuth()
  async get(@Param('id') id: string) {
    const team = await this.teamService.findById(id);
    return {
      ...team,
      applicant: JSON.parse(team.applicant),
      owner: { ...(await team.owner), password: undefined },
      member: (await team.member).map((e) => {
        e.password = undefined;
        return e;
      }),
    };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '팀 생성',
    description: '현재 로그인되어 있는 유저가 팀을 생성합니다.',
  })
  @ApiCreatedResponse({
    description: '팀이 성공적으로 생성됩니다.',
    type: GetTeamDto,
  })
  @ApiBadRequestResponse({ description: '팀 이름이 겹치는 경우 발생합니다.' })
  @ApiUnauthorizedResponse({
    description: '로그인이 되어있지 않은 경우 발생합니다.',
  })
  @ApiCookieAuth()
  async create(@Body() body: CreateTeamDto, @Req() req) {
    return await this.teamService.create(body, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '팀 삭제',
    description: '팀을 삭제합니다.',
  })
  @ApiOkResponse({ description: '성공적으로 팀이 삭제됩니다.' })
  @ApiBadRequestResponse({
    description: '팀이 존재하지 않거나 멤버가 아닌 경우 발생합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 되어있지 않은 경우 발생합니다.',
  })
  @ApiForbiddenResponse({ description: '팀장이 아닌 경우 발생합니다.' })
  @ApiParam({ name: 'id', required: true, description: '팀 UUID' })
  @ApiCookieAuth()
  async remove(@Param('id') id: string, @Req() req, @Res() res) {
    await this.teamService.remove(id, req.user);
    return res.sendStatus(HttpStatus.OK);
  }
}
