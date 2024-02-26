import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Webhook } from "../../webhook/Entity/webhook.entity";

@Entity({ name: 'test' })
export class Test {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;

}
