import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne
} from "typeorm";
import { Meal } from "../../meal/entities/meal.entity";
import { Goal } from "../../goal/entities/goal.entity";
import { Exercise } from "../../exercise/entities/exercise.entity";

export enum ActivityLevel {
  SEDENTARY = "sedentary",
  LIGHTLY_ACTIVE = "lightly active",
  MODERATELY_ACTIVE = "moderately active",
  ACTIVE = "active",
  VERY_ACTIVE = "very active",
} 

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Meal, (meal) => meal.user)
  meals!: Meal[];

  @OneToOne(() => Goal, (goal) => goal.user)
  goal!: Goal;

  @OneToMany(() => Exercise, (exercise) => exercise.user)
  exercises!: Exercise[];

  @Column({ type: "float", nullable: true })
  weight!: number;

  @Column({ type: "float", nullable: true })
  height!: number;

  @Column({
    type: "enum",
    enum: ["male", "female"],
    nullable: true,
  })
  gender!: "male" | "female";

  @Column({
    type: "enum",
    enum: ActivityLevel,
    nullable: true,
  })
  activityLevel!: "sedentary" | "lightly active" | "moderately active" | "active" | "very active";
}