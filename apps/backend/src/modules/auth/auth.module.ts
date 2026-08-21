import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { RedisCacheService } from 'src/common/redis-cache/redis-cache.service';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { AuthCacheRepository } from './repos/auth-cache.repo';

@Module({
  imports: [
    UserModule,
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RedisCacheService,
    PrismaService,
    GoogleStrategy,
    AuthCacheRepository,
    GithubStrategy,
  ],
})
export class AuthModule {}
