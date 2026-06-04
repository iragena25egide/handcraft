import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "text" })
  description: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  originalPrice: number;

  @Column("decimal", { precision: 3, scale: 1, default: 5.0 })
  rating: number;

  @Column()
  artisan: string;

  @Column()
  image: string;

  @Column()
  category: string;

  @Column({ type: "int", default: 0 })
  stockQuantity: number;

  @ManyToOne(() => User, (user) => user.products)
  seller: User;

  @CreateDateColumn()
  createdAt: Date;
}
