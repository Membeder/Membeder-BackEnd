import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
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
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TeamNoticeService } from './team-notice.service';
import { GetTeamNoticeDto } from './dto/get-team-notice.dto';
import { CreateTeamNoticeDto } from './dto/create-team-notice.dto';
import { UpdateTeamNoticeDto } from './dto/update-team-notice.dto';

@ApiTags('Team Notice')
@Controller('team/notice')
export class TeamNoticeController {
  constructor(private readonly teamNoticeService: TeamNoticeService) {}

  @Get('/:team_id/:notice_id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'team_id',
    required: true,
    description: '팀 UUID',
  })
  @ApiParam({
    name: 'notice_id',
    required: true,
    description: '팀 공지 UUID',
  })
  @ApiOperation({
    summary: '팀 공지 가져오기',
    description: '팀 공지를 가져옵니다.',
  })
  @ApiOkResponse({
    description: '팀 공지를 가져옵니다.',
    type: GetTeamNoticeDto,
  })
  @ApiCookieAuth()
  async get(
    @Param('team_id') team_id: string,
    @Param('notice_id') notice_id: string,
  ) {
    return await this.teamNoticeService.get(team_id, notice_id);
  }

  @Post('/:team_id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'team_id',
    required: true,
    description: '팀 UUID',
  })
  @ApiOperation({
    summary: '팀 공지 추가하기',
    description: '팀 공지를 추가합니다.',
  })
  @ApiOkResponse({
    description: '팀 공지를 추가합니다.',
    type: GetTeamNoticeDto,
  })
  @ApiCookieAuth()
  async create(
    @Param('team_id') team_id: string,
    @Req() req,
    @Body() data: CreateTeamNoticeDto,
  ) {
    return await this.teamNoticeService.create(team_id, req.user.id, data);
  }

  @Patch('/:team_id/:notice_id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'team_id',
    required: true,
    description: '팀 UUID',
  })
  @ApiParam({
    name: 'notice_id',
    required: true,
    description: '팀 공지 UUID',
  })
  @ApiOperation({
    summary: '팀 공지 수정하기',
    description: '팀 공지를 수정합니다.',
  })
  @ApiOkResponse({
    description: '팀 공지를 수정합니다.',
    type: GetTeamNoticeDto,
  })
  @ApiCookieAuth()
  async update(
    @Param('team_id') team_id: string,
    @Param('notice_id') notice_id: string,
    @Req() req,
    @Body() data: UpdateTeamNoticeDto,
  ) {
    return await this.teamNoticeService.update(
      team_id,
      notice_id,
      req.user.id,
      data,
    );
  }

  @Delete('/:team_id/:notice_id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'team_id',
    required: true,
    description: '팀 UUID',
  })
  @ApiParam({
    name: 'notice_id',
    required: true,
    description: '팀 공지 UUID',
  })
  @ApiOperation({
    summary: '팀 공지 제거하기',
    description: '팀 공지를 제거합니다.',
  })
  @ApiOkResponse({ description: '팀 공지를 제거합니다.' })
  @ApiCookieAuth()
  async remove(
    @Param('team_id') team_id: string,
    @Param('notice_id') notice_id: string,
    @Req() req,
    @Res() res,
  ) {
    await this.teamNoticeService.remove(team_id, notice_id, req.user.id);
    res.sendStatus(HttpStatus.OK);
  }
}
