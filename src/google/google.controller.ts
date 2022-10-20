import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GoogleService } from './google.service';
import { GoogleProfileDto } from './dto/google-profile.dto';
import { GoogleVerifyDto } from './dto/google-verify.dto';

@ApiTags('Google')
@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get('/')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: '구글 로그인',
    description: '구글 OAuth를 이용하여 로그인을 합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '구글 로그인 페이지로 이동합니다.',
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  async auth(@Req() req) {}

  @Get('/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: '구글 로그인 콜백',
    description:
      '구글에서 로그인하고 받은 값으로 회원가입 여부 및 토큰을 발급합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      '구글에서 로그인하고 받은 값으로 회원가입 여부 및 토큰을 발급합니다.',
    type: GoogleProfileDto,
  })
  async callback(@Req() req, @Res() res) {
    const data = await this.googleService.callback(req.user);
    if (data.accessToken) res.cookie('Authentication', data.accessToken);
    res.send(data);
  }

  @Post('/')
  @ApiOperation({
    summary: '구글 로그인 인증',
    description:
      '구글에서 받은 ID Token으로 구글 인증 여부를 확인하고 회원가입 여부 및 토큰을 발급합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      '구글 인증 여부를 확인하고 회원가입 여부 및 토큰을 출력합니다.',
    type: GoogleProfileDto,
  })
  @ApiUnauthorizedResponse({
    description: '토큰이 올바르지 않은 경우 발생합니다.',
  })
  async verifyMobile(@Body() { idToken }: GoogleVerifyDto, @Res() res) {
    const payload = await this.googleService.verifyIdToken(idToken);
    const data = await this.googleService.callback(payload);
    if (data.accessToken) res.cookie('Authentication', data.accessToken);
    res.send(data);
  }
}
