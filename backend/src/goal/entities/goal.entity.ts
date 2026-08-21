import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Goal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  dailyCalories!: number;

  @Column({ nullable: true })
  proteinGoal!: number;

  @Column({ nullable: true })
  carbsGoal!: number;

  @Column({ nullable: true })
  fatGoal!: number;

  @Column({ nullable: true })
  waterGoal!: number;

  @Column({ nullable: true })
  stepsGoal!: number;

  @Column({ type: "float", nullable: true })//con decimales 
  sleepGoal!: number;

  @Column({ nullable: true })
  workoutsPerWeek!: number;

  @OneToOne(() => User, (user) => user.goal)
  @JoinColumn()
  user!: User;
}