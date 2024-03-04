import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { Webhook } from './Entity/webhook.entity';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestModule } from 'src/test/test.module';
import { TestService } from "../test/test.service";
import { Test } from "../test/Entity/test.entity";
import { JwtMiddleware } from "./jwt.middleware";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "../auth/auth.module";
import { AuthService } from "../auth/auth.service";
import { UserModule } from "../user/user.module";
import { EventsController } from "./events.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Webhook,Test]),
    TestModule,
    AuthModule,
    UserModule,
    JwtModule.register({
      secret: 'nounou', // Replace with your JWT secret key
      signOptions: { expiresIn: '1h' }, // Example expiration time
    }),
  ],
  providers: [
    WebhookService,
    TestService,
    AuthService,
  ],
  controllers: [WebhookController,EventsController],

})
export class WebhookModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
