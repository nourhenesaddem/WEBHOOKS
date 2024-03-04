import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
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
  console.log('Microservice is connected to RabbitMQ');

}
bootstrap();