import { env } from '../../config/env';
// src/common/database/mongo-database.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: env.MONGODB_URI,
        // Optional connection options for production optimization
        autoIndex: true, // Ensures our 30-day TTL index is automatically created
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class MongoDatabaseModule {}
