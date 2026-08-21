import { env } from '@day-mark/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';

export interface GithubOAuthUser {
  providerAccountId: string;
  provider: 'GITHUB';
  email: string;
  firstName: string;
  lastName: string;
  picture: string | null;
}

export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: env.GITHUB_AUTH_CLIENT_ID,
      clientSecret: env.GITHUB_AUTH_CLIENT_SECRET,
      callbackURL: env.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    });
  }

  validate(
    access_token: string,
    refresh_token: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ) {
    const { id, emails, photos, displayName, username } = profile;

    if (!emails || emails.length === 0) {
      return done(
        new Error('No email associated with this Github account'),
        null,
      );
    }

    const nameParts = (displayName || username || '').split(' ');
    const firstName: string = nameParts[0] || '';
    const lastName: string = nameParts.slice(1).join(' ') || '';

    const normalizedUser: GithubOAuthUser = {
      providerAccountId: id,
      provider: 'GITHUB',
      email: emails[0].value,
      firstName,
      lastName,
      picture: photos?.[0]?.value || null,
    };

    done(null, normalizedUser);
  }
}
