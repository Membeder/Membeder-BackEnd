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
import { GetUserDto } from './dto/get-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({
    summary: '유저 조회',
    description: '유저 UUID를 이용하여 유저를 조회합니다.',
  })
  @ApiOkResponse({
    description: '유저 UUID를 이용하여 유저 정보를 출력합니다.',
    type: GetUserDto,
  })
  @ApiBadRequestResponse({ description: '유저 정보가 없는 경우 발생합니다.' })
  @ApiParam({ name: 'id', required: true, description: '유저 UUID' })
  async get(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (user) {
      user.password = undefined;
      return { ...user, team: await user.team };
    } else {
      throw new HttpException(
        'User information not found.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '유저 정보 수정',
    description: '유저 정보를 수정합니다.',
  })
  @ApiOkResponse({
    description: '유저 정보를 수정합니다.',
    type: GetUserDto,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 되어있지 않은 경우 발생합니다.',
  })
  @ApiCookieAuth()
  async update(@Body() data: UpdateUserDto, @Req() req) {
    await this.userService.update(req.user.id, data);
    const result = await this.userService.findById(req.user.id);
    result.password = undefined;
    return result;
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '유저 삭제',
    description: '유저를 삭제합니다.',
  })
  @ApiOkResponse({ description: '유저를 삭제합니다.' })
  @ApiUnauthorizedResponse({
    description: '로그인이 되어있지 않은 경우 발생합니다.',
  })
  @ApiCookieAuth()
  async remove(@Req() req, @Res() res) {
    await this.userService.remove(req.user.id);
    res.sendStatus(HttpStatus.OK);
  }
}
