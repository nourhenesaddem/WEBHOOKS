import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Webhook } from './Entity/webhook.entity';
import { CreateWebhookDto } from './dto/create.webhook.dto';
import { UpdateData } from './dto/update.data';
import { Repository } from 'typeorm';
import axios from 'axios';
import { User } from "../user/entities/user.entity";

@Injectable()
export class WebhookService {
  constructor(
    @InjectRepository(Webhook)
    private readonly webhookRepository: Repository<Webhook>) {}

  async getAll(): Promise<Webhook[]> {
    return this.webhookRepository.find();
  }
  async processWebhook(payload: any) {
    // Process the incoming data
    console.log('Received webhook data:', payload);
  }
  async handleWebhook(payload: any): Promise<void> {
    const { organizationId, eventType } = payload;
    const webhooks = await this.webhookRepository.find();
    console.log(webhooks);
    for (const webhook of webhooks) {
      if ( webhook.organizationId === organizationId && webhook.events === eventType ) {
        await this.sendHttpRequest(webhook.endpointUrl, payload);
      }
    }
  }

  //async handleWebhook(payload: any): Promise<void> {
  //  const { organizationId, eventType } = payload;
  //  const webhooks = await this.webhookRepository.find({ where: { organizationId: organizationId } });
  //  console.log(webhooks);
  //  for (const webhook of webhooks) {
  //    if (webhook.events === eventType ) {
  //      await this.sendHttpRequest(webhook.endpointUrl, payload);
  //    }
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
    webhook.organizationId = organizationId;
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

  /*findByUserId*/
  async findByUserId(userId: number): Promise<Webhook[]> {
    return this.webhookRepository.find({ where: { user: { userId } } });
  }



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