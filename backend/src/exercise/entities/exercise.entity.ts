import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";

import { User } from "../../user/entities/user.entity";

@Entity()
export class Exercise {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column("float")
  duration!: number;

  @Column("float")
  caloriesBurned!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.exercises,
    {
      onDelete: "CASCADE"
    }
  )
  user!: User;

  @Column("float")
  baseCaloriesBurned!: number;

  @Column("float")
  baseDuration!: number;
}