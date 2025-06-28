// /server/src/entities/murmur.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    ManyToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity('murmurs')
export class Murmur {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 280 })
    text: string;

    @ManyToOne(() => User, (user) => user.murmurs, {
        eager: true,
        onDelete: 'CASCADE',
    })
    user: User;

    @ManyToMany(() => User, (user) => user.likes)
    likedBy: User[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}