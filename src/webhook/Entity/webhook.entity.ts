// webhook.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Check } from "typeorm";
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

  //@Column({
  //  type: 'simple-array',
  //  enum: Events
  //})
  //events: Events[];

  @Column("json")
  @Check(`JSON_EXTRACT(events, '$[*]') NOT SIMILAR TO '"test_created"|"test_updated"'`)
  events: string[];

  @Column()
  orgId: number;

  @ManyToOne(() => User, user => user.webhooks)
  @JoinColumn({ name: 'userId' })
  user: User;

}
