import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Webhook } from './Entity/webhook.entity';
import { CreateWebhookDto } from './dto/create.webhook.dto';
import { UpdateData } from './dto/update.data';
import { Repository } from 'typeorm';
import axios from 'axios';
import { User } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";

@Injectable()
export class WebhookService {
  constructor(
    @InjectRepository(Webhook)
    private readonly webhookRepository: Repository<Webhook>,
    private readonly userService: UserService) {}

  async getAll(): Promise<Webhook[]> {
    return this.webhookRepository.find();
  }
  async processWebhook(payload: any) {
    // Process the incoming data
    console.log('Received webhook data:', payload);
  }

  async handleWebhook(payload: any): Promise<void> {
    try {
      const { eventData, eventType } = payload;
      const webhooks = await this.webhookRepository.find();
      console.log("*** Webhooks:", webhooks);

      for (const webhook of webhooks) {
        if (webhook.orgId === eventData.organizationId && webhook.events && webhook.events.includes(eventType)) {
          console.log("*** Checking webhook:", webhook);
          console.log(`*** Sending HTTP request to ${webhook.endpointUrl} for orgId : ${eventData.organizationId} event ${eventType}`);
          await this.sendHttpRequest(webhook.endpointUrl, payload);
        }
      }
    } catch (error) {
      console.error("Error handling webhook:", error);
      // Handle error appropriately, such as logging or throwing further
    }
  }


  //async handleWebhook(payload: any): Promise<void> {
  //  try {
  //    const { organizationId, eventType } = payload;
  //    //console.log("Payload:", payload);
  //
  //    const webhooks = await this.webhookRepository.find({ where: { orgId: organizationId } });
  //    console.log("*** Webhooks:", webhooks);
  //
  //    for (const webhook of webhooks) {
  //      console.log("*** Checking webhook:", webhook);
  //
  //      if (webhook.events === eventType) {
  //        console.log(`*** Sending HTTP request to ${webhook.endpointUrl} for event ${eventType}`);
  //        await this.sendHttpRequest(webhook.endpointUrl, payload);
  //      }
  //    }
  //
  //  } catch (error) {
  //    console.error("Error handling webhook:", error);
  //    // Handle error appropriately, such as logging or throwing further
  //  }
  //}

  private async sendHttpRequest(url: string, data: any): Promise<void> {
    try {
      await axios.post(url, data);
    } catch (error) {
      console.error('Error sending HTTP request:', error.message);
    }
  }
  async create(createWebhookDto: CreateWebhookDto): Promise<Webhook> {
    const { organizationId, ...rest } = createWebhookDto;

    // Ensure organizationId is a numeric value if it's meant to be the foreign key
    const webhook = new Webhook();
    webhook.orgId = organizationId;
    Object.assign(webhook, rest);
    // Save the webhook to the database
    return await this.webhookRepository.save(webhook);
  }

  async findByOrgId(organizationId: number): Promise<Webhook[]> {
    return this.webhookRepository.find({ where: { id: organizationId } });
  }

  async getById(id: number): Promise<Webhook> {
    const webhook = await this.webhookRepository.findOne({ where: { id } });
    if (!webhook) {
      throw new Error(`Webhook with ID ${id} not found.`);
    }
    return webhook;
  }

  async update(id: number, updateData: UpdateData): Promise<Webhook> {
    const webhook = await this.webhookRepository.findOne({ where: { id } });
    if (!webhook) {
      throw new Error(`Webhook with ID ${id} not found.`);
    }
    Object.assign(webhook, updateData);
    await this.webhookRepository.save(webhook);
    return webhook;
  }

  async delete(id: number): Promise<any> {
    const result = await this.webhookRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Webhook with ID ${id} not found.`);
    }
    return result;
  }

  //async getEnumValues(): Promise<string[]> {
  //    const webhooks = await this.webhookRepository.find();
  //    return webhooks.map(webhook => webhook.events);
  //}



  //getEventEnumValues(): string[] {
  //  // Retrieve the events enum values from the database or any other data source
  //  // Example: return enum values stored in an array
  //  return ['Event1', 'Event2', 'Event3'];
  //}



}

  //async createWebhook(createWebhookDto: CreateWebhookDto): Promise<Webhook> {
  //  // Transform the DTO object into a format expected by webhookRepository.create
  //  const webhookdata = {
  //    name: createWebhookDto.name,
  //    eventName: createWebhookDto.event,
  //    endpoint: createWebhookDto.endpointUrl,
  //  };
  //  const webhook = this.webhookRepository.create(webhookdata);
  //  return this.webhookRepository.save(webhook);
  //}