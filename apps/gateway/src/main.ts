import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    GatewayModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);

  // OpenAPI (Swagger)
  const config = new DocumentBuilder()
    .setTitle('WeGoWhere Backend Test - Chat API')
    .setDescription('Backend Test for WeGoWhere.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(
    configService.get<number>('gateway.port'),
    configService.get<string>('gateway.host'),
  );
}
bootstrap();
