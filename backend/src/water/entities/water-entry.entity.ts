import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";

import { User } from "../../user/entities/user.entity";

@Entity()
export class WaterEntry {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  amount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User)
  user!: User;

}