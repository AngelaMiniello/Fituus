import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";

import { User } from "../../user/entities/user.entity";

@Entity()
export class Meal {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column("float")
  calories!: number;

  @Column("float",{ nullable: true })
  protein!: number;

  @Column("float",{ nullable: true })
  carbs!: number;

  @Column("float",{ nullable: true })
  fat!: number;

  @Column({ nullable: true })
  mealType!: string;

  @Column({ nullable: true })
  image!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.meals)
  user!: User;

  @Column({ type:"float"})
  quantity!:number;

  @Column("float")
  baseCalories!:number;

  @Column("float")
  baseProtein!:number;

  @Column("float")
  baseCarbs!:number;

  @Column("float")
  baseFat!:number;
}