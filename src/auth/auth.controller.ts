import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUser.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { AuthGuard } from './auth.guard';
import { User } from './user.decorator';
import { VerifyUserDto } from './dto/VerifyUser.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("register")
    async register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.registerUser(registerUserDto);
    }

    @Post("login")
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.loginUser(loginUserDto);
    }

    @UseGuards(AuthGuard)
    @Post("verify")
    async verify(@Body() verifyUserDto: VerifyUserDto) {
        return this.authService.verifyUser(verifyUserDto);
    }

    @UseGuards(AuthGuard)
    @Get("profile")
    async getProfile(@User() userId: string) {
        return this.authService.getProfile(userId);
    }
}
