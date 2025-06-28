import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Like } from 'typeorm';
import { Murmur } from '../../entities/murmur.entity';
import { User } from '../../entities/user.entity';
import { Notification, NotificationType } from '../../entities/notification.entity';
import { CreateMurmurDto } from '../dto/create-murmur.dto';

type PaginationOptions = { page: number; limit: number; };

@Injectable()
export class MurmursService {
  constructor(
      @InjectRepository(Murmur) private murmursRepository: Repository<Murmur>,
      @InjectRepository(User) private usersRepository: Repository<User>,
      @InjectRepository(Notification) private notificationsRepository: Repository<Notification>,
  ) {}

  async create(createMurmurDto: CreateMurmurDto, userId: number): Promise<Murmur> {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['followers'] });
    if (!user) { throw new NotFoundException('User not found.'); }

    const newMurmur = this.murmursRepository.create({ text: createMurmurDto.text, user });
    await this.murmursRepository.save(newMurmur);

    const notifications = user.followers.map(follower => {
      return this.notificationsRepository.create({
        recipient: follower,
        sender: user,
        type: NotificationType.NEW_MURMUR,
        murmur: newMurmur,
      });
    });

    if (notifications.length > 0) {
      await this.notificationsRepository.save(notifications);
    }

    delete newMurmur.user.password;
    delete newMurmur.user.email;
    return newMurmur;
  }

  async remove(murmurId: number, currentUserId: number): Promise<void> {
    const murmur = await this.murmursRepository.findOne({ where: { id: murmurId }, relations: ['user'] });
    if (!murmur) { throw new NotFoundException(`Murmur with ID ${murmurId} not found.`); }
    if (murmur.user.id !== currentUserId) { throw new ForbiddenException('You are not authorized to delete this murmur.'); }
    await this.murmursRepository.remove(murmur);
  }

  async getTimelineForUser(userId: number, options: PaginationOptions) {
    const userWithFollowing = await this.usersRepository.findOne({ where: { id: userId }, relations: ['following'] });
    if (!userWithFollowing) { throw new NotFoundException('User not found'); }
    const followedUserIds = userWithFollowing.following.map((user) => user.id);
    const authorIds = [userId, ...followedUserIds];

    const queryBuilder = this.murmursRepository.createQueryBuilder('murmur').leftJoinAndSelect('murmur.user', 'user').where('murmur.userId IN (:...authorIds)', { authorIds });
    queryBuilder.addSelect((subQuery) => subQuery.select('COUNT(likes.userId)', 'likeCount').from('likes', 'likes').where('likes.murmurId = murmur.id'), 'likeCount');
    queryBuilder.addSelect((subQuery) => subQuery.select('CASE WHEN COUNT(my_likes.userId) > 0 THEN 1 ELSE 0 END', 'isLikedByMe').from('likes', 'my_likes').where('my_likes.murmurId = murmur.id').andWhere('my_likes.userId = :currentUserId', { currentUserId: userId }), 'isLikedByMe');
    const total = await queryBuilder.getCount();
    const rawAndEntities = await queryBuilder.orderBy('murmur.createdAt', 'DESC').skip((options.page - 1) * options.limit).take(options.limit).getRawAndEntities();
    const mergedData = rawAndEntities.entities.map((murmur, index) => ({ ...murmur, likeCount: parseInt(rawAndEntities.raw[index].likeCount, 10), isLikedByMe: rawAndEntities.raw[index].isLikedByMe === 1, }));
    return { data: mergedData, total, page: options.page, last_page: Math.ceil(total / options.limit) };
  }

  async like(murmurId: number, userId: number): Promise<void> {
    const murmur = await this.murmursRepository.findOne({ where: { id: murmurId }, relations: ['likedBy'] });
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!murmur || !user) { throw new NotFoundException('Murmur or User not found.'); }
    const isAlreadyLiked = murmur.likedBy.some((u) => u.id === user.id);
    if (!isAlreadyLiked) { murmur.likedBy.push(user); await this.murmursRepository.save(murmur); }
  }

  async unlike(murmurId: number, userId: number): Promise<void> {
    const murmur = await this.murmursRepository.findOne({ where: { id: murmurId }, relations: ['likedBy'] });
    if (!murmur) { throw new NotFoundException('Murmur not found.'); }
    murmur.likedBy = murmur.likedBy.filter((u) => u.id !== userId);
    await this.murmursRepository.save(murmur);
  }

  async findMurmurById(murmurId: number, currentUserId: number) {
    const queryBuilder = this.murmursRepository.createQueryBuilder('murmur').leftJoinAndSelect('murmur.user', 'user').where('murmur.id = :murmurId', { murmurId });
    queryBuilder.addSelect((subQuery) => subQuery.select('COUNT(likes.userId)', 'likeCount').from('likes', 'likes').where('likes.murmurId = murmur.id'), 'likeCount');
    queryBuilder.addSelect((subQuery) => subQuery.select('CASE WHEN COUNT(my_likes.userId) > 0 THEN 1 ELSE 0 END', 'isLikedByMe').from('likes', 'my_likes').where('my_likes.murmurId = murmur.id').andWhere('my_likes.userId = :currentUserId', { currentUserId }), 'isLikedByMe');
    const result = await queryBuilder.getRawAndEntities();
    if (!result.entities.length) { throw new NotFoundException(`Murmur with ID ${murmurId} not found.`); }
    const murmur = result.entities[0];
    const rawData = result.raw[0];
    return { ...murmur, likeCount: parseInt(rawData.likeCount, 10), isLikedByMe: rawData.isLikedByMe === 1, };
  }

  async findAll(currentUserId: number, options: PaginationOptions) {
    const queryBuilder = this.murmursRepository.createQueryBuilder('murmur').leftJoinAndSelect('murmur.user', 'user');
    queryBuilder.addSelect((subQuery) => subQuery.select('COUNT(likes.userId)', 'likeCount').from('likes', 'likes').where('likes.murmurId = murmur.id'), 'likeCount');
    queryBuilder.addSelect((subQuery) => subQuery.select('CASE WHEN COUNT(my_likes.userId) > 0 THEN 1 ELSE 0 END', 'isLikedByMe').from('likes', 'my_likes').where('my_likes.murmurId = murmur.id').andWhere('my_likes.userId = :currentUserId', { currentUserId }), 'isLikedByMe');
    const total = await queryBuilder.getCount();
    const rawAndEntities = await queryBuilder.orderBy('murmur.createdAt', 'DESC').skip((options.page - 1) * options.limit).take(options.limit).getRawAndEntities();
    const mergedData = rawAndEntities.entities.map((murmur, index) => ({ ...murmur, likeCount: parseInt(rawAndEntities.raw[index].likeCount, 10), isLikedByMe: rawAndEntities.raw[index].isLikedByMe === 1, }));
    return { data: mergedData, total, page: options.page, last_page: Math.ceil(total / options.limit) };
  }
}