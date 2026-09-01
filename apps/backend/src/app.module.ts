import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { RedisCacheModule } from './common/redis-cache/redis-cache.module';
import { HealthModule } from './modules/health/health.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HabitsModule } from './modules/habits/habits.module';
import { HabitLogService } from './modules/habits/habit-log/habit-log.service';
import { GoalsModule } from './modules/goals/goals.module';
import { QueueModule } from './common/queues/queue.module';
import { GamificationModule } from './common/gamification/gamification.module';
import { NotificationModule } from './modules/notification/notification.module';
import { LocalRedisModule } from './common/local-redis/local-redis.module';
import { MongoDatabaseModule } from './common/database/mongo-database.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    AuthModule,
    PrismaModule,
    UserModule,
    MongoDatabaseModule,
    RedisCacheModule,
    GamificationModule,
    HealthModule,
    TasksModule,
    HabitsModule,
    GoalsModule,
    QueueModule,
    LocalRedisModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService, HabitLogService],
})
export class AppModule {}
