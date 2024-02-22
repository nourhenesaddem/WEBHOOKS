import { Controller, Post, Body, Get, Inject } from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create.test.dto';
import { ClientProxy, EventPattern } from "@nestjs/microservices";

@Controller('test')
export class TestController {
  constructor(
    private readonly testService: TestService,
    /*private readonly httpService: HttpService,*/
    @Inject('TEST_SERVICE') private readonly client: ClientProxy

  ) {}

  @Get()
  getAll() {
    this.client.emit('hello', 'Hello from RabbitMQ!')
    return this.testService.getAll();
  }
  @EventPattern('hello')
  async hello(data:string){
    console.log(data);
  }

  /*@EventPattern('TEST_CREATED')
  async created(test: any){
    await this.testService.create(CreateTestDto);
  };*/

  @EventPattern('TEST_CREATED')
  async created(test: any) {
    const dto: CreateTestDto = {
      title: test.title,
    };
    const createdTest = await this.testService.create(dto);
    return createdTest;
  }

  /*async created(test: any) {
    const dto: CreateTestDto = {
      title: test.title, // Map the title property from the event payload
    };

    const createdTest = await this.testService.create(dto);

    // Send HTTP POST request to another application
    const otherAppUrl = 'http://example.com/endpoint'; // Replace with the URL of the other application's endpoint
    const postData = { /* Add your payload data here ************* };

    try {
      const response = await this.httpService.post(otherAppUrl, postData).toPromise();
      console.log('HTTP POST request sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending HTTP POST request:', error.message);
    }

    return createdTest;
  }*/

}
