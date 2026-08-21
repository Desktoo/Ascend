import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { env } from '@day-mark/config';
import { JwtService } from '@nestjs/jwt';
import type { Prisma } from '@day-mark/db';
import { RedisCacheService } from '../../common/redis-cache/redis-cache.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Response } from 'express';
import { Resend } from 'resend';
import { randomBytes } from 'crypto';
import { AuthCacheRepository } from './repos/auth-cache.repo';

interface AuthenticatedUserSession {
  id: string;
  email: string;
  userName: string;
}

export interface IOAuthUser {
  providerAccountId: string;
  provider: 'GITHUB' | 'GOOGLE' | 'CREDENTIALS';
  email: string;
  firstName: string;
  lastName: string;
  timeZone: string;
  picture: string | null;
}

@Injectable()
export class AuthService {
  private resend: Resend;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private redisService: RedisCacheService,
    private authCache: AuthCacheRepository,
    private prismaSerive: PrismaService,
  ) {
    this.resend = new Resend(env.RESEND_API);
  }

  async validateUser(
    identifier: string,
    password: string,
  ): Promise<Omit<Prisma.UserCreateInput, 'password'>> {
    const user = await this.userService.findByIdentifier(identifier);

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const localAccount = user.accounts.find(
      (acc) => acc.provider === 'CREDENTIALS',
    );

    if (!localAccount || !localAccount.password) {
      throw new UnauthorizedException(
        'this account does not have password credentials. Please log in using your linked social provider',
      );
    }

    const isMatch = await bcrypt.compare(
      password + env.BCRYPT_SECRET_PEPPER,
      localAccount.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { accounts, ...result } = user;
    return result;
  }

  async login(
    user: AuthenticatedUserSession,
    res: Response,
  ): Promise<{ success: boolean; access_token: string }> {
    const payload = {
      userId: user.id,
      email: user.email,
      userName: user.userName,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    await this.authCache.setRefreshToken(user.id, refresh_token, 604800);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { success: true, access_token };
  }

  async sendForgotPasswordEmail(email: string): Promise<void> {
    const user = await this.userService.findByIdentifier(email);

    if (!user) {
      throw new BadRequestException(
        'User does not exist with this email address',
      );
    }
    const resetToken = randomBytes(32).toString('hex');

    // 4. Store the token mapped to the User ID in Redis with a 5-minute TTL (300 seconds)
    const redisKey = `password-reset:${resetToken}`;
    await this.redisService.set(redisKey, user.id, 300);

    // 5. Build your Next.js application endpoint address URL
    const resetLink = `http://localhost:3001/reset-password?token=${resetToken}`;

    // 6. Send the transactional email securely via Resend
    try {
      await this.resend.emails.send({
        from: 'Ascend Security <onboarding@ascendup.online>', // Change to your verified Resend domain later
        to: email,
        subject: 'Reset your Daymark Password',
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; rounded: 8px;">
            <h2 style="color: #18181b; margin-bottom: 16px;">Password Reset Request</h2>
            <p style="color: #4b5563; line-height: 1.5; font-size: 14px;">
              We received a request to reset your password for your Daymark account. Click the button below to configure a new password.
            </p>
            <div style="margin: 24px 0; text-align: center;">
              <a href="${resetLink}" style="background-color: #18181b; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block; font-size: 14px;">
                Reset Password
              </a>
            </div>
            <p style="color: #71717a; font-size: 12px; line-height: 1.5; border-top: 1px solid #e4e4e7; padding-top: 16px;">
              This secure link will expire in <b>5 minutes</b>. If you did not make this request, you can safely ignore this email.
            </p>
          </div>
        `,
      });
    } catch (error) {
      // Prevent Redis clean failures if Resend fails during transport execution
      await this.redisService.del(redisKey);
      throw new Error(
        `Failed to dispatch reset email communications link: ${error}`,
      );
    }
  }

  async validateOrCreateOAuthUser(oauthUser: IOAuthUser, res: Response) {
    try {
      const existingAccount = await this.userService.findAccountByProvider(
        oauthUser.provider,
        oauthUser.providerAccountId,
      );

      if (existingAccount) {
        return this.login(
          {
            id: existingAccount.user.id,
            email: existingAccount.user.email,
            userName: existingAccount.user.email,
          },
          res,
        );
      }

      const existingUser = await this.userService.findByIdentifier(
        oauthUser.email,
      );

      if (existingUser) {
        await this.prismaSerive.client.$transaction(
          async (tx: Prisma.TransactionClient) => {
            await this.userService.linkAccount(
              tx,
              existingUser.id,
              'oauth',
              oauthUser.provider,
              oauthUser.providerAccountId,
              null,
            );
          },
        );
        return this.login(
          {
            id: existingUser.id,
            email: existingUser.email,
            userName: existingUser.userName,
          },
          res,
        );
      } else {
        const newUser = await this.prismaSerive.client.$transaction(
          async (tx: Prisma.TransactionClient) => {
            const baseName = `${oauthUser.firstName}${oauthUser.lastName}`
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '');
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            const uniqueUserName = `${baseName}${randomNum}`;

            const user = await this.userService.createUserProfile(
              tx,
              oauthUser.email,
              uniqueUserName,
              oauthUser.timeZone,
              oauthUser.picture,
            );

            await this.userService.linkAccount(
              tx,
              user.id,
              'oauth',
              oauthUser.provider,
              oauthUser.providerAccountId,
              null,
            );
            return user;
          },
        );
        return this.login(
          {
            id: newUser.id,
            email: newUser.email,
            userName: newUser.userName,
          },
          res,
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Social Auth Pipeline Failure: ${message}`);
    }
  }

  async refreshTokens(
    refreshToken: string,
    res: Response,
  ): Promise<{ success: boolean }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    try {
      const decoded = await this.jwtService.verifyAsync<{
        userId: string;
        email: string;
        userName: string;
      }>(refreshToken, { secret: env.JWT_REFRESH_SECRET });

      const cachedRefreshToken = await this.authCache.getRefreshToken(
        decoded.userId,
      );

      if (!cachedRefreshToken || cachedRefreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid or expired session state');
      }

      const newAccessToken = this.jwtService.sign(
        {
          userId: decoded.userId,
          email: decoded.email,
          userName: decoded.userName,
        },
        {
          secret: env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      );

      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        sameSite: 'lax',
        // secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000,
      });

      return { success: true };
    } catch (error) {
      throw new UnauthorizedException('Session Expired. Please log back in', {
        cause: error,
      });
    }
  }

  async resetPassword(token: string, newpassword: string): Promise<void> {
    const rediskey = `password-reset:${token}`;

    const userId = await this.redisService.get(rediskey);

    if (!userId) {
      throw new BadRequestException(
        'The Password reset link is invalid or has expired (5-minute window passed)',
      );
    }

    await this.userService.updatePassword(userId, newpassword);

    await this.redisService.del(rediskey);
    console.log(
      `[Token Spent] Redis tracking element evicted for key payload: ${token}`,
    );
  }

  logout(response: Response) {
    // const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      // TODO:
      // secure: isProduction,
      sameSite: 'lax' as const,
      path: '/',
      expires: new Date(0),
    };

    response.clearCookie('access_token', cookieOptions);
    response.clearCookie('refresh_token', cookieOptions);
  }
}
