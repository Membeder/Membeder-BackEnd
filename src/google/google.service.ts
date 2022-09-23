import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class GoogleService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async callback(callback: any) {
    let accessToken;
    const user = await this.userService.findByEmail(callback.email);
    if (!!user) accessToken = await this.authService.createAccessToken(user.id);
    return {
      ...callback,
      registered: !!user,
      accessToken,
    };
  }
}
