import { Events } from "./events";

export class CreateWebhookDto {
  readonly name: string;
  readonly endpointUrl: string;
  readonly description: string;
  readonly events: Events;
  readonly organizationId: number;
}
