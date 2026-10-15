import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("weight_entry")
export class WeightEntry {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "double precision" })
  weight!: number;

  @CreateDateColumn({ type: "timestamptz" })
  recordedAt!: Date;

  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
  user!: User;
}
