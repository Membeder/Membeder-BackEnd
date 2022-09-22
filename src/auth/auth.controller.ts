import {
  Body,
  Controller,
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async getUser(@Req() req) {
    req.user.password = undefined;
    return req.user;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  async signUp(@Body() user: CreateUserDto) {
    return this.authService.signUp(user);
  }

  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async signIn(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res,
    @Req() req,
  ) {
    if (req.cookies['Authentication']) return res.send('Already Logged In');
    const user = req.user;
    const token = await this.authService.generateToken(user);
    res.cookie('Authentication', token.accessToken);
    user.password = undefined;
    res.send(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async signOut(@Req() req, @Res() res) {
    res.clearCookie('Authentication');
    return res.sendStatus(HttpStatus.OK);
  }
}
