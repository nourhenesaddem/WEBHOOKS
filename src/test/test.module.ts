import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from './Entity/test.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
imports: [TypeOrmModule.forFeature([Test]),
ClientsModule.register([
  {
    name: 'TEST_SERVICE',
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'main_queue',
      queueOptions: {
        durable: false
      },
    },
  },
]),
],
  providers: [TestService],
  controllers: [TestController],
  exports: [TestService],
})
export class TestModule {}
