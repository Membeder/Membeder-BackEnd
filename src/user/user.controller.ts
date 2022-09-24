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
  })
  @ApiParam({ name: 'id', required: true, description: '유저 UUID' })
  find(@Param('id') id: string) {
    return this.userService.find(id);
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
  })
  @ApiParam({ name: 'id', required: true, description: '유저 UUID' })
  @ApiCookieAuth()
  update(@Param('id') id: string, @Body() data: UpdateUserDto, @Req() req) {
    if (req.user.id != id)
      throw new HttpException(undefined, HttpStatus.UNAUTHORIZED);
    return this.userService.update(id, data);
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
  remove(@Param('id') id: string, @Req() req) {
    if (req.user.id != id)
      throw new HttpException(undefined, HttpStatus.UNAUTHORIZED);
    return this.userService.remove(id);
  }
}
