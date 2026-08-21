import { env } from '@day-mark/config';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  };
}

interface RequestWithCookies extends Request {
  cookies: {
    refresh_token?: string;
    access_token?: string;
  };
}

@Injectable()
export class AuthGaurd implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithCookies>();

    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('Unauthorized: Missing token');

    try {
      const decoded = await this.jwtService.verifyAsync<{ userId: string }>(
        token,
        {
          secret: env.JWT_ACCESS_SECRET,
        },
      );

      request['user'] = { userId: decoded.userId };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Unauthorized: Invalid token', {
        cause: error,
      });
    }

    return true;
  }

  private extractTokenFromHeader(
    request: RequestWithCookies,
  ): string | undefined {
    const token = request.cookies?.access_token;

    return token;
  }
}
