import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

import { JwtDto, UserDto, LoginRequestDto, RefreshRequestDto, RegisterRequestDto } from './dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async register(dto: RegisterRequestDto): Promise<UserDto> {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException({
                error: 'Conflict',
                message: 'User with this email already exists',
                statusCode: 409,
            });
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                firstName: dto.firstName,
                lastName: dto.lastName,
            },
        });

        return this.mapUserToDto(user);
    }

    async login(loginDto: LoginRequestDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
        });

        if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
            throw new UnauthorizedException({
                error: 'Unauthorized',
                message: 'Invalid email or password',
                statusCode: 401,
            });
        }

        const payload = { sub: user.id, role: user.role, email: user.email };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.get<string>('auth.jwtExpiresIn'),
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.get<string>('auth.jwtRefreshExpiresIn'),
        });

        return {
            accessToken,
            refreshToken,
            user: this.mapUserToDto(user),
        };
    }

    async refreshToken(dto: RefreshRequestDto) {
        const payload = await this.verifyToken(dto.refreshToken);
        return this.generateTokens(payload.sub, payload.email, payload.role);
    }

    async getUserById(userId: string): Promise<UserDto | null> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new UnauthorizedException({
                error: 'Unauthorized',
                message: 'User not found',
                statusCode: 401,
            });
        }
        return this.mapUserToDto(user);
    }

    private async verifyToken(token: string): Promise<JwtDto> {
        return this.jwtService.verifyAsync(token);
    }

    private generateTokens(userId: string, email: string, role: string) {
        const payload = { sub: userId, email, role };
        return {
            accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
        };
    }

    private mapUserToDto(user: User): UserDto {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive,
            passwordResetToken: user.passwordResetToken ?? undefined,
            deletedAt: user.deletedAt ?? undefined,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
