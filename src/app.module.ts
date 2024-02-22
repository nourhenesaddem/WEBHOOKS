import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WebhookModule } from './webhook/webhook.module';
import { Webhook } from './webhook/Entity/webhook.entity';
import { EventModule } from './event/event.module';
import { Test } from "./test/Entity/test.entity";
import { TestModule } from "./test/test.module";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { User } from "./user/entities/user.entity";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [AuthModule,ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [Webhook,Test,User],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    WebhookModule,
    EventModule,
    TestModule,
    UserModule,
    EventEmitterModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
