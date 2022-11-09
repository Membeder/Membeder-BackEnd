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
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamInfoDto } from './dto/team-info.dto';
import { FindTeamDto } from './dto/find-team.dto';
import { TeamListDto } from './dto/team-list.dto';

@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '팀 리스트',
    description: '팀 리스트를 조회합니다.',
  })
  @ApiOkResponse({
    description: '팀 리스트를 출력합니다.',
    type: TeamListDto,
  })
  @ApiCookieAuth()
  async find(@Query() option: FindTeamDto) {
    const team = await this.teamService.find(option);
    return {
      team: team.map((e) => {
        return {
          ...e,
          applicant: { ...e.applicant, id: undefined },
          permission: [...e.permission.user],
          schedule: e.schedule.sort((o1, o2) => {
            return +o1.deadline > +o2.deadline ? 1 : -1;
          }),
        };
      }),
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '팀 조회',
    description: '팀 UUID를 이용하여 팀를 조회합니다.',
  })
  @ApiOkResponse({
    description: '팀 UUID를 이용하여 팀 정보를 출력합니다.',
    type: TeamInfoDto,
  })
  @ApiBadRequestResponse({ description: '팀 정보가 없는 경우 발생합니다.' })
  @ApiParam({ name: 'id', required: true, description: '팀 UUID' })
  @ApiCookieAuth()
  async get(@Param('id') id: string) {
    const team = await this.teamService.findById(id);
    return {
      team: {
        ...team,
        applicant: { ...team.applicant, id: undefined },
        permission: [...team.permission.user],
        schedule: team.schedule.sort((o1, o2) => {
          return +o1.deadline > +o2.deadline ? 1 : -1;
        }),
      },
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
    type: TeamInfoDto,
  })
  @ApiBadRequestResponse({ description: '팀 이름이 겹치는 경우 발생합니다.' })
  @ApiUnauthorizedResponse({
    description: '로그인이 되어있지 않은 경우 발생합니다.',
  })
  @ApiCookieAuth()
  async create(@Body() body: CreateTeamDto, @Req() req) {
    const team = await this.teamService.create(body, req.user.id);
    return {
      team: {
        ...team,
        applicant: { ...team.applicant, id: undefined },
        permission: [...team.permission.user],
        schedule: team.schedule.sort((o1, o2) => {
          return +o1.deadline > +o2.deadline ? 1 : -1;
        }),
      },
    };
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

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '팀 수정',
    description: '팀 정보를 수정합니다.',
  })
  @ApiOkResponse({
    description: '성공적으로 팀 정보가 수정됩니다.',
    type: TeamInfoDto,
  })
  @ApiBadRequestResponse({
    description: '팀이 존재하지 않는다면 발생합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 되어있지 않은 경우 발생합니다.',
  })
  @ApiForbiddenResponse({ description: '팀장이 아닌 경우 발생합니다.' })
  @ApiParam({ name: 'id', required: true, description: '팀 UUID' })
  @ApiCookieAuth()
  async update(@Param('id') id: string, @Body() body: UpdateTeamDto) {
    const team = await this.teamService.update(id, body);
    return {
      team: {
        ...team,
        applicant: { ...team.applicant, id: undefined },
        permission: [...team.permission.user],
        schedule: team.schedule.sort((o1, o2) => {
          return +o1.deadline > +o2.deadline ? 1 : -1;
        }),
      },
    };
  }

  @Post('/:team_id/:user_id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '팀원 추가',
    description: '팀원을 추가합니다.',
  })
  @ApiOkResponse({
    description: '성공적으로 팀윈이 추가됩니다.',
    type: TeamInfoDto,
  })
  @ApiBadRequestResponse({
    description:
      '팀이 존재하지 않거나 유저가 존재하지 않거나 유저가 이미 팀에 존재한다면 발생합니다.',
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
    const team = await this.teamService.addUser(team_id, user_id, req.user.id);
    return {
      team: {
        ...team,
        applicant: { ...team.applicant, id: undefined },
        permission: [...team.permission.user],
        schedule: team.schedule.sort((o1, o2) => {
          return +o1.deadline > +o2.deadline ? 1 : -1;
        }),
      },
    };
  }

  @Delete('/:team_id/:user_id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '팀원 제거',
    description: '팀원을 제거합니다.',
  })
  @ApiOkResponse({
    description: '성공적으로 팀윈이 제거됩니다.',
    type: TeamInfoDto,
  })
  @ApiBadRequestResponse({
    description:
      '팀이 존재하지 않거나 유저가 존재하지 않거나 유저가 팀에 존재하지 않는다면 발생합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 되어있지 않은 경우 발생합니다.',
  })
  @ApiForbiddenResponse({ description: '팀장이 아닌 경우 발생합니다.' })
  @ApiParam({ name: 'team_id', required: true, description: '팀 UUID' })
  @ApiParam({ name: 'user_id', required: true, description: '유저 UUID' })
  @ApiCookieAuth()
  async removeUser(
    @Param('team_id') team_id: string,
    @Param('user_id') user_id: string,
    @Req() req,
  ) {
    const team = await this.teamService.removeUser(
      team_id,
      user_id,
      req.user.id,
    );
    return {
      team: {
        ...team,
        applicant: { ...team.applicant, id: undefined },
        permission: [...team.permission.user],
        schedule: team.schedule.sort((o1, o2) => {
          return +o1.deadline > +o2.deadline ? 1 : -1;
        }),
      },
    };
  }
}
