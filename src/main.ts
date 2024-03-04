import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { Transport } from "@nestjs/microservices";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['http://localhost:5173'], // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
    preflightContinue: false,
    credentials: true,
  });
  const RMQapp = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'main_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  await RMQapp.listen();
  await app.listen(3001);
  console.log('Microservice is connected to RabbitMQ');
}

bootstrap();


