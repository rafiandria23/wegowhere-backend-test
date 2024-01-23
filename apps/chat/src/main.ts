import { NestFactory } from '@nestjs/core';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { ChatModule } from './chat.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    ChatModule,
    new FastifyAdapter(),
  );

  await app.listen(3000);
}
bootstrap();
