import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
  Res,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserInfoDto } from '../auth/dto/user-info.dto';
import { AvailavleUserDto } from './dto/available-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('available')
  @ApiOperation({
    summary: '유저 정보 중복 확인',
    description: '유저 정보가 중복되는지 확인힙나다.',
  })
  @ApiOkResponse({ description: '유저 정보가 겹치지 않는 경우 발생합니다.' })
  @ApiBadRequestResponse({ description: '유저 정보가 겹치는 경우 발생합니다.' })
  async available(@Query() data: AvailavleUserDto, @Res() res) {
    const result = await this.userService.available(data);
    res.sendStatus(result ? HttpStatus.BAD_REQUEST : HttpStatus.OK);
  }

  @Get(':id')
  @ApiOperation({
    summary: '유저 조회',
    description: '유저 UUID를 이용하여 유저를 조회합니다.',
  })
  @ApiOkResponse({
    description: '유저 UUID를 이용하여 유저 정보를 출력합니다.',
    type: UserInfoDto,
  })
  @ApiBadRequestResponse({ description: '유저 정보가 없는 경우 발생합니다.' })
  @ApiParam({ name: 'id', required: true, description: '유저 UUID' })
  async get(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (user) return { user };
    else
      throw new HttpException(
        'User information not found.',
        HttpStatus.BAD_REQUEST,
      );
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '유저 정보 수정',
    description: '유저 정보를 수정합니다.',
  })
  @ApiOkResponse({
    description: '유저 정보를 수정합니다.',
    type: UserInfoDto,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 되어있지 않은 경우 발생합니다.',
  })
  @ApiCookieAuth()
  async update(@Body() data: UpdateUserDto, @Req() req) {
    await this.userService.update(req.user.id, data);
    return { user: await this.userService.findById(req.user.id) };
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '유저 삭제',
    description: '유저를 삭제합니다.',
  })
  @ApiOkResponse({ description: '유저를 삭제합니다.' })
  @ApiBadRequestResponse({
    description: '유저가 소유한 팀이 있을 경우 발생합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 되어있지 않은 경우 발생합니다.',
  })
  @ApiCookieAuth()
  async remove(@Req() req, @Res() res) {
    await this.userService.remove(req.user.id);
    res.sendStatus(HttpStatus.OK);
  }
}
