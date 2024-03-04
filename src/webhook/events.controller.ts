import { Controller, Get } from "@nestjs/common";
import { Events } from "./dto/events";
@Controller('events')
export class EventsController {
  @Get()
  getEvents(): string[] {
    return Object.values(Events);
  }
}