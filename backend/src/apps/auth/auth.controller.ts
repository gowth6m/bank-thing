import {
    UserDto,
    LoginRequestDto,
    LoginResponseDto,
    RefreshRequestDto,
    RegisterRequestDto,
    RefreshResponseDto,
    AuthenticatedRequest,
} from 'src/apps/auth/dto';
import { Get, Req, Body, Post, HttpCode, UseGuards, Controller } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly userService: AuthService) {}

    @ApiResponse({
        status: 201,
        description: 'User registered successfully',
        type: UserDto,
    })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 409, description: 'Conflict' })
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterRequestDto })
    @Post('register')
    @HttpCode(201)
    register(@Body() registerDto: RegisterRequestDto): Promise<UserDto> {
        return this.userService.register(registerDto);
    }

    @ApiResponse({
        status: 200,
        description: 'User logged in successfully',
        type: LoginResponseDto,
    })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiOperation({ summary: 'Login a user' })
    @ApiBody({ type: LoginRequestDto })
    @HttpCode(200)
    @Post('login')
    login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
        return this.userService.login(loginDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Token refreshed successfully',
        type: RefreshResponseDto,
    })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiOperation({ summary: 'Refresh user token' })
    @ApiBody({ type: RefreshRequestDto })
    @UseGuards(JwtAuthGuard)
    @Post('refresh-token')
    @ApiBearerAuth()
    @HttpCode(200)
    refreshToken(@Body() refreshRequestDto: RefreshRequestDto): Promise<RefreshResponseDto> {
        return this.userService.refreshToken(refreshRequestDto);
    }

    @ApiResponse({
        status: 200,
        description: 'Current user retrieved successfully',
        type: UserDto,
    })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiOperation({ summary: 'Get current user' })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('current')
    @HttpCode(200)
    getCurrentUser(@Req() req: AuthenticatedRequest): Promise<UserDto | null> {
        const userId = req.user['sub'];
        return this.userService.getUserById(userId);
    }
}
