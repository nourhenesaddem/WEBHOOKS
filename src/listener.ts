import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'main_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  /*app.listen(() => {
    console.log('Microservice is connected to RabbitMQ');
  });*/
  await app.listen();
  console.log('Microservice is connected to RabbitMQ');

}
bootstrap();