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
  @MessagePattern('WEBHOOK')
  getNotifications(@Payload() payload: any , @Ctx() context: RmqContext) {
    console.log( payload );
  }
  @Get()
  async getAll() {
    return this.webhookService.getAll();
  }
  //@Post('add')
  ////@UseGuards(AuthGuard())
  //async create(@Body() createWebhookDto: CreateWebhookDto) {
  //  return this.webhookService.create(createWebhookDto);
  //}



  @Post('add')
  async create(@Body() createWebhookDto: CreateWebhookDto, @Req() request: Request) {
    const organizationId = request['organizationId']; // Retrieve organizationId from the request object
    return this.webhookService.create({ ...createWebhookDto, organizationId });
  }


  //@Post('add')
  //async create(
  //  @Body() createWebhookDto: CreateWebhookDto,
  //  @Headers('authorization') authHeader: string,
  //) {
  //  const organizationId = this.extractOrganizationIdFromHeader(authHeader);
  //  if (!organizationId) {
  //    throw new UnauthorizedException('Invalid authorization header');
  //  }
  //  return this.webhookService.create({ ...createWebhookDto, organizationId: +organizationId });
  //  // Convert organizationId to a number using the '+' operator or parseInt()
  //}
//
  //private extractOrganizationIdFromHeader(authHeader: string): string | null {
  //  if (!authHeader) {
  //    return null;
  //  }
  //  const token = authHeader.split(' ')[1];
  //  const decodedToken = this.authService.decodeToken(token);
  //  // Assuming your decoded token contains organizationId as a number
  //  return decodedToken.organizationId.toString(); // Convert it to string if it's a number
  //}
  //@Post('add')
  //async create(
  //  @Body() createWebhookDto: CreateWebhookDto,
  //  @Headers('authorization') authHeader: string,
  //  @Req() request: Request,
  //) {
  //  const organizationId = this.extractOrganizationIdFromHeader(authHeader);
  //  return this.webhookService.create({ ...createWebhookDto, organizationId });
  //}
//
  //private extractOrganizationIdFromHeader(authHeader: string): string | null {
  //  if (!authHeader) {
  //    return null;
  //  }
  //  const token = authHeader.split(' ')[1];
  //  const decodedToken = this.authService.decodeToken(token);
  //  // Assuming your decoded token contains organizationId
  //  return decodedToken.organizationId || null;
  //}
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
