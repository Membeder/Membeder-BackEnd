import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { UserInfoTokenDto } from './dto/user-info-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '현재 유저 조회',
    description: '현재 로그인되어 있는 유저를 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '현재 로그인되어 있는 유저를 조회합니다.',
    type: UserInfoDto,
  })
  @ApiCookieAuth()
  async getUser(@Req() req) {
    req.user.password = undefined;
    return { user: req.user };
  }

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '유저 회원가입',
    description: '회원가입을 하여 유저를 생성합니다.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '회원가입을 하여 유저를 생성합니다.',
    type: UserInfoDto,
  })
  async signUp(@Body() user: CreateUserDto) {
    const result = await this.authService.signUp(user);
    result.password = undefined;
    return { user: result };
  }

  @Post()
  @UseGuards(AuthGuard('local'))
  @ApiOperation({
    summary: '유저 로그인',
    description: '이메일과 비밀번호를 이용하여 로그인을 합니다.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '이메일과 비밀번호를 이용하여 로그인을 합니다.',
    type: UserInfoTokenDto,
  })
  async signIn(@Body() body: LoginUserDto, @Res() res, @Req() req) {
    const token = await this.authService.generateToken(req.user);
    res.cookie('Authentication', token.accessToken);
    req.user.password = undefined;
    res.send({
      user: req.user,
      ...token,
    });
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '유저 로그아웃',
    description: '유저를 로그아웃합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '유저를 로그아웃합니다.',
  })
  @ApiCookieAuth()
  async signOut(@Req() req, @Res() res) {
    res.clearCookie('Authentication');
    return res.sendStatus(HttpStatus.OK);
  }
}
