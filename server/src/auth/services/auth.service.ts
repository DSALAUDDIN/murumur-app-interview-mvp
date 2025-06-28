import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterUserDto): Promise<Omit<User, 'password'>> {
        const { username, email, password } = registerDto;
        const existingUser = await this.usersRepository.findOne({
            where: [{ email }, { username }],
        });
        if (existingUser) {
            throw new ConflictException('Username or email already exists.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({
            username,
            email,
            password: hashedPassword,
        });
        await this.usersRepository.save(user);
        delete user.password;
        return user;
    }
    async login(loginDto: LoginUserDto): Promise<{ accessToken: string }> {
        const { email, password } = loginDto;

        const user = await this.usersRepository
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .addSelect('user.password')
            .getOne();
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, username: user.username };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}