import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GoogleService } from './google.service';

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
    description: '구글 OAuth를 이용하여 로그인을 합니다.',
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
  })
  async callback(@Req() req, @Res() res) {
    const data = await this.googleService.callback(req.user);
    if (data.accessToken) res.cookie('Authentication', data.accessToken);
    res.send(data);
  }
}
