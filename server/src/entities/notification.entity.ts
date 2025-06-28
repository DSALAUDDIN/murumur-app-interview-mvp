import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Murmur } from './murmur.entity';

export enum NotificationType {
    NEW_MURMUR = 'new_murmur',
}

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    recipient: User;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    sender: User;

    @Column({ type: 'enum', enum: NotificationType })
    type: NotificationType;

    @Column({ default: false })
    isRead: boolean;

    @ManyToOne(() => Murmur, { nullable: true, onDelete: 'CASCADE' })
    murmur: Murmur | null;

    @CreateDateColumn()
    createdAt: Date;
}