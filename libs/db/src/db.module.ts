import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from '@app/common';

@Module({
  imports: [
    CommonModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      async useFactory(configService: ConfigService) {
        return {
          uri: `mongodb://${configService.get<string>('db.host')}:${configService.get<number>('db.port')}`,
          user: configService.get<string>('db.user'),
          pass: configService.get<string>('db.pass'),
          dbName: configService.get<string>('db.name'),
        };
      },
    }),
  ],
})
export class DbModule {}
