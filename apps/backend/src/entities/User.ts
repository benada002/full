import {
  Entity, PrimaryGeneratedColumn, Column, Index, OneToMany, BaseEntity,
} from 'typeorm';
import { Device } from './Device';
import { Post } from './Post';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @Index({ unique: true })
  username: string;

  @Column({ nullable: false })
  @Index({ unique: true })
  email: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Post, ({ user }) => user)
  posts: Post[];

  @OneToMany(() => Device, ({ user }) => user)
  devices: Device[];
}
