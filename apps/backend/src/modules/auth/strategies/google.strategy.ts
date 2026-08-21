import { env } from '@day-mark/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';

export interface GoogleOAuthUser {
  providerAccountId: string;
  provider: 'GOOGLE';
  email: string;
  firstName: string;
  lastName: string;
  picture: string | null;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  validate(
    access_token: string,
    refresh_token: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { id, name, emails, photos } = profile;

    if (!emails || emails.length === 0) {
      return done(new Error('No email associated with this Google account'));
    }

    const oauthUser: GoogleOAuthUser = {
      providerAccountId: id,
      provider: 'GOOGLE',
      email: emails[0].value,
      firstName: name?.givenName || '',
      lastName: name?.familyName || '',
      picture: photos?.[0]?.value || null,
    };

    done(null, oauthUser);
  }
}
