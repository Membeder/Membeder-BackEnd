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
    const newUser = await this.userService.create({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    });
    return await this.userService.create(newUser);
  }

  async validate(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.userService.findByEmail(email);
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch)
        throw new HttpException(null, HttpStatus.UNAUTHORIZED);
      user.password = undefined;
      return user;
    } catch (e) {
      Logger.log(e);
      throw new HttpException(null, HttpStatus.UNAUTHORIZED);
    }
  }

  async signUp(user: CreateUserDto): Promise<User> {
    const existUser = await this.userService.findByEmail(user.email);
    if (existUser)
      throw new HttpException('Email is already exist', HttpStatus.BAD_REQUEST);
    const data = await this.createUser(user);
    data.password = undefined;
    return data;
  }

  async generateToken(user: User): Promise<{ accessToken: string }> {
    const accessToken = await this.createAccessToken(user.id);
    user.password = undefined;
    return { accessToken };
  }
}
