import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private readonly ACCESS_TOKEN_SECRET: string;
  private readonly ACCESS_TOKEN_EXPIRES_IN: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.ACCESS_TOKEN_SECRET = this.configService.get<string>(
      'ACCESS_TOKEN_SECRET',
    );
    this.ACCESS_TOKEN_EXPIRES_IN = this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRES_IN',
    );
  }

  async createAccessToken(id: string): Promise<string> {
    return await this.jwtService.signAsync(
      { id },
      {
        secret: this.ACCESS_TOKEN_SECRET,
        expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
      },
    );
  }

  private async createUser(user: CreateUserDto): Promise<User> {
    if (user.type == 'email' && !user.password)
      throw new HttpException(undefined, HttpStatus.BAD_REQUEST);
    const password = user.password
      ? await bcrypt.hash(user.password, 10)
      : user.password;
    const newUser = await this.userService.create({
      ...user,
      password,
    });
    return await this.userService.create(newUser);
  }

  async validate(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.userService.findByEmail(email);
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch)
        throw new HttpException(undefined, HttpStatus.UNAUTHORIZED);
      user.password = undefined;
      return user;
    } catch (e) {
      Logger.log(e);
      throw new HttpException(undefined, HttpStatus.UNAUTHORIZED);
    }
  }

  async signUp(user: CreateUserDto): Promise<User> {
    const { nickname } = user;
    const existEmail = await this.userService.findByEmail(user.email);
    const existNickname = await this.userService.find({ nickname });
    if (existEmail)
      throw new HttpException('Email is already exist', HttpStatus.BAD_REQUEST);
    if (existNickname.length > 0)
      throw new HttpException(
        'Nickname is already exist',
        HttpStatus.BAD_REQUEST,
      );
    return await this.createUser(user);
  }

  async generateToken(user: User): Promise<{ accessToken: string }> {
    const accessToken = await this.createAccessToken(user.id);
    user.password = undefined;
    return { accessToken };
  }
}
