import { ScheduleService } from './schedule.service';
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
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { GetScheduleDto } from './dto/get-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@ApiTags('Schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('/:team_id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '일정 추가',
    description: '일정을 추가합니다.',
  })
  @ApiOkResponse({
    description: '성공적으로 일정이 추가됩니다.',
    type: GetScheduleDto,
  })
  @ApiBadRequestResponse({
    description: '팀이 존재하지 않거나 일정 이름이 겹칠 경우 발생합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 되어있지 않은 경우 발생합니다.',
  })
  @ApiForbiddenResponse({ description: '권한이 없는 경우 발생합니다.' })
  @ApiParam({ name: 'team_id', required: true, description: '팀 UUID' })
  @ApiCookieAuth()
  async create(
    @Param('team_id') team_id: string,
    @Body() body: CreateScheduleDto,
    @Req() req,
  ) {
    const data = await this.scheduleService.create(team_id, body, req.user.id);
    return {
      ...data,
      permission: data.permission.user,
    };
  }

  @Patch('/:team_id/:schedule_id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '일정 수정',
    description: '일정을 수정합니다.',
  })
  @ApiOkResponse({
    description: '성공적으로 일정이 수정됩니다.',
    type: GetScheduleDto,
  })
  @ApiBadRequestResponse({
    description: '팀이 존재하지 않거나 일정이 없는 경우 발생합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 되어있지 않은 경우 발생합니다.',
  })
  @ApiParam({ name: 'team_id', required: true, description: '팀 UUID' })
  @ApiParam({ name: 'schedule_id', required: true, description: '일정 UUID' })
  @ApiCookieAuth()
  async update(
    @Param('team_id') team_id: string,
    @Param('schedule_id') schedule_id: string,
    @Body() body: UpdateScheduleDto,
    @Req() req,
  ) {
    const data = await this.scheduleService.update(
      team_id,
      schedule_id,
      body,
      req.user.id,
    );
    return {
      ...data,
      permission: data.permission.user,
    };
  }
}
