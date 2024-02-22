import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Webhook } from "../../webhook/Entity/webhook.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({unique: true})
  email: string;

  @Column()
  organizationId: number;

  @OneToMany(() => Webhook, webhook => webhook.user)
  webhooks: Webhook[];
}
