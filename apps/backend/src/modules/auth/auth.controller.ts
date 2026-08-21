import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
  SignUpDto,
} from './dto/auth-dto';
import { AuthService, IOAuthUser } from './auth.service';
import { UserService } from '../user/user.service';
import type { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import { env } from '@day-mark/config';
import { Prisma } from '@day-mark/db';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Cookie } from 'src/common/decorators/cookie.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authServices: AuthService,
    private userService: UserService,
    private prismaService: PrismaService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ access_token: string }> {
    const user = await this.authServices.validateUser(
      loginDto.identifier,
      loginDto.password,
    );
    const { access_token } = await this.authServices.login(
      {
        id: user.id as string,
        email: user.email,
        userName: user.userName,
      },
      response,
    );

    return { access_token };
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() signupDto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ access_token: string }> {
    const passwordHash = await bcrypt.hash(
      signupDto.password + env.BCRYPT_SECRET_PEPPER,
      10,
    );

    const newUser = await this.prismaService.client.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const profile = await this.userService.createUserProfile(
          tx,
          signupDto.email,
          signupDto.userName,
          signupDto.timeZone,
        );

        await this.userService.linkAccount(
          tx,
          profile.id,
          'credentials',
          'CREDENTIALS',
          // TODO: make this as accountProvider ID
          profile.id,
          passwordHash,
        );

        return profile;
      },
    );

    const { access_token } = await this.authServices.login(
      {
        id: newUser.id,
        email: newUser.email,
        userName: newUser.userName,
      },
      response,
    );

    return { access_token };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authServices.sendForgotPasswordEmail(forgotPasswordDto.email);

    return {
      success: true,
      message:
        'If an account exists with this email, a reset link has been sent.',
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authServices.resetPassword(dto.token, dto.password);
    return { message: 'Password has been safely updated.' };
  }

  @Post('refresh')
  async refresh(
    @Cookie('refresh_token') refresh_token: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!refresh_token) {
      throw new UnauthorizedException('Missing refresh token session cookie');
    }

    return this.authServices.refreshTokens(refresh_token, res);
  }

  // GOOGLE OAuth Handlers

  @Get('google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Req() req: Request) {}

  @Get('callback/google')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const googleUser = req.user as IOAuthUser;

    await this.authServices.validateOrCreateOAuthUser(googleUser, response);

    response.redirect(`http://localhost:3001/dashboard`);
  }

  // GITHUB OAuth Handlers

  @Get('github')
  @UseGuards(AuthGuard('github'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async githubAuth(@Req() req: Request) {}

  @Get('callback/github')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const githubUser = req.user as IOAuthUser;

    await this.authServices.validateOrCreateOAuthUser(githubUser, response);

    response.redirect(`http://localhost:3001/dashboard`);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    this.authServices.logout(response);

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Session cleared. Tokens rotated to invalid state safely.',
    };
  }
}
