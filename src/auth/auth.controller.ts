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
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
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
  @ApiOkResponse({
    description: '현재 로그인되어 있는 경우 유저 정보를 출력합니다.',
    type: UserInfoDto,
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 되어있지 않은 경우 발생합니다.',
  })
  @ApiCookieAuth()
  async getUser(@Req() req) {
    return {
      user: {
        ...req.user,
        team: req.user.team.map((e) => {
          return {
            ...e,
            schedule:
              e.schedule &&
              e.schedule.sort((o1, o2) => {
                return +o1.deadline > +o2.deadline ? 1 : -1;
              }),
          };
        }),
      },
    };
  }

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '유저 회원가입',
    description: '회원가입을 하여 유저를 생성합니다.',
  })
  @ApiCreatedResponse({
    description: '회원가입을 하여 유저를 생성하고 유저 정보를 출력합니다.',
    type: UserInfoTokenDto,
  })
  @ApiBadRequestResponse({
    description: '이메일이나 닉네임이 이미 존재하는 경우 발생합니다.',
  })
  async signUp(@Body() user: CreateUserDto, @Req() req, @Res() res) {
    const result = await this.authService.signUp(user);
    const token = await this.authService.generateToken(result);
    res.cookie('Authentication', token.accessToken);
    res.send({
      user: {
        ...result,
        team:
          result.team &&
          result.team.map((e) => {
            return {
              ...e,
              schedule:
                e.schedule &&
                e.schedule.sort((o1, o2) => {
                  return +o1.deadline > +o2.deadline ? 1 : -1;
                }),
            };
          }),
      },
      ...token,
    });
  }

  @Post()
  @UseGuards(AuthGuard('local'))
  @ApiOperation({
    summary: '유저 로그인',
    description: '이메일과 비밀번호를 이용하여 로그인을 합니다.',
  })
  @ApiCreatedResponse({
    description:
      '이메일과 비밀번호를 이용하여 로그인을 하고 토큰을 출력합니다. 토큰은 Cookie에서 Authorization에 넣어줍니다.',
    type: UserInfoTokenDto,
  })
  @ApiUnauthorizedResponse({
    description: '이메일이나 비밀번호가 일치하지 않는 경우 발생합니다.',
  })
  async signIn(@Body() body: LoginUserDto, @Res() res, @Req() req) {
    const token = await this.authService.generateToken(req.user);
    res.cookie('Authentication', token.accessToken);
    res.send({
      user: {
        ...req.user,
        team: req.user.team.map((e) => {
          return {
            ...e,
            schedule:
              e.schedule &&
              e.schedule.sort((o1, o2) => {
                return +o1.deadline > +o2.deadline ? 1 : -1;
              }),
          };
        }),
      },
      ...token,
    });
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '유저 로그아웃',
    description: '유저를 로그아웃합니다.',
  })
  @ApiOkResponse({ description: '유저를 로그아웃합니다.' })
  @ApiUnauthorizedResponse({
    description: '로그인이 되어있지 않은 경우 발생합니다.',
  })
  @ApiCookieAuth()
  async signOut(@Req() req, @Res() res) {
    res.clearCookie('Authentication');
    return res.sendStatus(HttpStatus.OK);
  }
}
