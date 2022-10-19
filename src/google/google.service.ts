import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

export interface GoogleProfile {
  name: string;
  family_name: string;
  given_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

@Injectable()
export class GoogleService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async callback(callback: any) {
    let accessToken;
    const user = await this.userService.findByEmail(callback.email);
    if (!!user) accessToken = await this.authService.createAccessToken(user.id);
    return {
      ...callback,
      registered: !!user,
      accessToken,
      provider: undefined,
      sub: undefined,
    };
  }

  async verifyIdToken(token: string): Promise<GoogleProfile> {
    try {
      const client_id = this.configService.get('OAUTH_GOOGLE_ID');
      const client = new OAuth2Client(client_id);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: client_id,
      });
      const payload = ticket.getPayload();
      return payload as GoogleProfile;
    } catch (e) {
      throw new HttpException(
        'Token authentication failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
