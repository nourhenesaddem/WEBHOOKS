import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Headers,
  Put,
  Delete,
  NotFoundException,
  UseGuards,
  Req,
  UnauthorizedException, Inject
} from "@nestjs/common";
import { WebhookService } from './webhook.service';
import { CreateWebhookDto } from './dto/create.webhook.dto';
import { UpdateData } from './dto/update.data';
import { CreateTestDto } from "../test/dto/create.test.dto";
import { TestService } from "../test/test.service";
import { Ctx, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";
import { Webhook } from "./Entity/webhook.entity";
import { AuthService } from "../auth/auth.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { LocalGuard } from "../auth/guards/local.guard";
import { Events } from "./dto/events";

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly testService: TestService,
    private readonly authService:AuthService) {}

  @Post('test')
  async hundleTestWebhook(@Body() data: CreateTestDto){
    await this.testService.create(data);
  }
  @Post('payload')
  async handleWebhook(@Body() payload: any) {
    // Process the incoming data using the webhook service
    await this.webhookService.processWebhook(payload);
    return { success: true };
  }
  //@MessagePattern('WEBHOOK')
  //getNotifications(@Payload() payload: any , @Ctx() context: RmqContext) {
  //  console.log( payload );
  //}

  @MessagePattern('WEBHOOK')
  async getNotifications(@Payload() payload: any, @Ctx() context: RmqContext) {
    console.log(payload);
    await this.webhookService.handleWebhook(payload);
  }
  @Get()
  async getAll() {
    return this.webhookService.getAll();
  }

  @Post('add')
  //@UseGuards(LocalGuard)
  async create(@Body() createWebhookDto: CreateWebhookDto, @Req() request: Request) {
    const organizationId = request['organizationId']; // Retrieve organizationId from the request object
    return this.webhookService.create({ ...createWebhookDto, organizationId });
  }

  @Get(':organizationId')
  async getWebhooksByUserId(@Param('organizationId') organizationId: number): Promise<Webhook[]> {
    return this.webhookService.findByOrgId(organizationId);
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.webhookService.getById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateData: UpdateData) {
    try {
      const updatedWebhook = await this.webhookService.update(id, updateData);
      return updatedWebhook;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<any> {
    return this.webhookService.delete(id);
  }

}
