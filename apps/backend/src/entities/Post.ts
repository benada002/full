import {
  Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, BaseEntity,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @Index({ unique: true })
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, ({ posts }) => posts)
  user: User;
}
