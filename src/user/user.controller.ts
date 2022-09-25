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
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: '현재 로그인되어 있는 유저를 조회합니다.',
    type: GetUserDto,
  })
  @ApiParam({ name: 'id', required: true, description: '유저 UUID' })
  async find(@Param('id') id: string, @Res() res) {
    const user = await this.userService.findById(id);
    if (user) {
      user.password = undefined;
      res.send(user);
    } else {
      res.status(HttpStatus.BAD_REQUEST);
      res.send({ statusCode: HttpStatus.BAD_REQUEST });
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '유저 정보 수정',
    description: '유저 정보를 수정합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '유저 정보를 수정합니다.',
    type: GetUserDto,
  })
  @ApiParam({ name: 'id', required: true, description: '유저 UUID' })
  @ApiCookieAuth()
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
    @Req() req,
  ) {
    if (req.user.id != id)
      throw new HttpException(undefined, HttpStatus.UNAUTHORIZED);
    await this.userService.update(id, data);
    const result = await this.userService.findById(id);
    result.password = undefined;
    return result;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '유저 삭제',
    description: '유저를 삭제합니다.',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '유저를 삭제합니다.' })
  @ApiParam({ name: 'id', required: true, description: '유저 UUID' })
  @ApiCookieAuth()
  async remove(@Param('id') id: string, @Req() req, @Res() res) {
    if (req.user.id != id)
      throw new HttpException(undefined, HttpStatus.UNAUTHORIZED);
    await this.userService.remove(id);
    res.sendStatus(HttpStatus.OK);
  }
}
