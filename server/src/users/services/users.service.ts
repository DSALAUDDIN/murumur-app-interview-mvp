// /server/src/users/services/users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Murmur } from '../../entities/murmur.entity';
import { Repository, In, Like } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Murmur)
        private murmursRepository: Repository<Murmur>,
    ) {}

    /**
     * Adds a "following" relationship from the current user to another user.
     */
    async follow(followerId: number, followingId: number): Promise<void> {
        const follower = await this.usersRepository.findOne({
            where: { id: followerId },
            relations: ['following'],
        });
        const userToFollow = await this.usersRepository.findOneBy({ id: followingId });
        if (!follower || !userToFollow) {
            throw new NotFoundException('User not found.');
        }
        const isAlreadyFollowing = follower.following.some((user: User) => user.id === userToFollow.id);
        if (!isAlreadyFollowing) {
            follower.following.push(userToFollow);
            await this.usersRepository.save(follower);
        }
    }

    /**
     * Removes a "following" relationship from the current user to another user.
     */
    async unfollow(followerId: number, followingId: number): Promise<void> {
        const follower = await this.usersRepository.findOne({
            where: { id: followerId },
            relations: ['following'],
        });
        if (!follower) {
            throw new NotFoundException('Follower not found.');
        }
        follower.following = follower.following.filter((user: User) => user.id !== followingId);
        await this.usersRepository.save(follower);
    }

    /**
     * Finds a user's public profile, including their murmurs and follow counts.
     */
    async findProfile(profileId: number, currentUserId: number) {
        const profile = await this.usersRepository.findOne({
            where: { id: profileId },
            relations: { murmurs: { user: true } },
            order: { murmurs: { createdAt: 'DESC' } },
        });

        if (!profile) {
            throw new NotFoundException('User profile not found.');
        }

        const followerCount = await this.usersRepository.count({ where: { following: { id: profileId } } });
        const followingCount = await this.usersRepository.count({ where: { followers: { id: profileId } } });

        const currentUser = await this.usersRepository.findOne({ where: { id: currentUserId }, relations: ['following'] });
        const isFollowing = currentUser.following.some((followedUser: User) => followedUser.id === profileId);

        const murmurIds = profile.murmurs.map(murmur => murmur.id);
        const murmursWithLikes = [];

        if (murmurIds.length > 0) {
            const likedMurmurs = await this.murmursRepository.find({
                where: { id: In(murmurIds), likedBy: { id: currentUserId } },
            });
            const likedMurmurIds = new Set(likedMurmurs.map(m => m.id));

            for (const murmur of profile.murmurs) {
                const likeCount = await this.usersRepository.count({ where: { likes: { id: murmur.id } } });
                murmursWithLikes.push({
                    ...murmur,
                    likeCount: likeCount,
                    isLikedByMe: likedMurmurIds.has(murmur.id),
                });
            }
        }

        delete profile.password;
        delete profile.email;

        return {
            ...profile,
            murmurs: murmursWithLikes,
            followerCount,
            followingCount,
            isFollowing,
        };
    }

    /**
     * Searches for users by a query string matching their username.
     */
    async searchUsers(query: string): Promise<User[]> {
        if (!query) {
            return [];
        }
        const users = await this.usersRepository.find({
            where: { username: Like(`%${query}%`) },
            take: 10,
        });
        return users.map(user => {
            delete user.password;
            delete user.email;
            return user;
        });
    }

    /**
     * Gets a list of users that a given user is following.
     */
    async getFollowing(userId: number): Promise<User[]> {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['following'],
        });

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        return user.following.map(u => {
            delete u.password;
            delete u.email;
            return u;
        });
    }

    /**
     * Gets a list of users who are following a given user.
     */
    async getFollowers(userId: number): Promise<User[]> {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['followers'],
        });

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        return user.followers.map(u => {
            delete u.password;
            delete u.email;
            return u;
        });
    }
}