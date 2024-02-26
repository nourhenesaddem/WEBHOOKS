// webhook.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Events } from "../dto/events";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Webhook {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()

  endpointUrl: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: Events })
  events: Events;

  @Column()
  organizationId: number;

  @ManyToOne(() => User, user => user.webhooks)
  @JoinColumn({ name: 'userId' })
  user: User;

}
