import { env } from '@day-mark/config';
import { INestApplicationContext, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import { Server, ServerOptions } from 'socket.io';

export class RedisIOAdapter extends IoAdapter {
  private adapterConstructor!: ReturnType<typeof createAdapter>;
  private readonly logger = new Logger(RedisIOAdapter.name);

  constructor(app: INestApplicationContext) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const pubClient = new Redis(env.QUEUE_REDIS_URL);
    const subClient = pubClient.duplicate();

    await Promise.all([
      new Promise<void>((resolve) => pubClient.on('ready', resolve)),
      new Promise<void>((resolve) => subClient.on('ready', resolve)),
    ]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
    this.logger.log('Connected to Redis Pub/Sub for WebSockets (K8s Ready)');
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, options) as Server;
    server.adapter(this.adapterConstructor);
    return server;
  }
}
