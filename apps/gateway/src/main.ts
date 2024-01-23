import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    GatewayModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(
    configService.get<number>('api.port'),
    configService.get<string>('api.host'),
  );
}
bootstrap();
