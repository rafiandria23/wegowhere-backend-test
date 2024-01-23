import { NestFactory } from '@nestjs/core';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { ChatModule } from './chat.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    ChatModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);

  await app.listen(
    configService.get<number>('api.port'),
    configService.get<string>('api.host'),
  );
}
bootstrap();
