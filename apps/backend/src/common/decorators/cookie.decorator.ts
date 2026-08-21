import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface RequestWithCookies extends Request {
  cookies: Record<string, string | undefined>;
}

export const Cookie = createParamDecorator(
  (key: string, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<RequestWithCookies>();
    return request.cookies?.[key];
  },
);
