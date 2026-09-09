import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { GamificationCacheRepository } from 'src/common/gamification/repos/gamification-cache.repo';
import { SelfReflectionService } from './self-reflection/self-reflection.service';
import { DynamoDbService } from 'src/common/dynamo-db/dynamo-db.service';
import { GamificationModule } from 'src/common/gamification/gamification.module';
import { TasksModule } from '../tasks/tasks.module';
import { UserActivityService } from './repos/user-activity.service';
import { UserCacheRepository } from './repos/user-cache.repo';
import { StorageService } from '../storage/storage.service';

@Module({
  imports: [PrismaModule, GamificationModule, forwardRef(() => TasksModule)],
  providers: [
    UserService,
    JwtService,
    GamificationCacheRepository,
    SelfReflectionService,
    DynamoDbService,
    UserActivityService,
    UserCacheRepository,
    StorageService,
  ],
  exports: [UserService, UserCacheRepository],
  controllers: [UserController],
})
export class UserModule {}
