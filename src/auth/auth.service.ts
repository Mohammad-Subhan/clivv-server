import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUser.dto';
import bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
    private readonly SALT_ROUNDS = 10;

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }

    async registerUser(registerUserDto: RegisterUserDto) {
        const hashedPassword = await bcrypt.hash(registerUserDto.password, this.SALT_ROUNDS);

        const existingUser = await this.userService.findOne({ email: registerUserDto.email });
        if (existingUser) {
            throw new ConflictException("User already exists");
        }

        const secretEncryptionSalt = randomBytes(16).toString("hex");

        const user = await this.userService.createUser({
            ...registerUserDto,
            password: hashedPassword,
            secretEncryptionSalt,
        });

        const payload = {
            sub: user._id
        }

        const token = await this.jwtService.signAsync(payload);
        return {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            access_token: token,
        }
    }

    async loginUser(loginUserDto: LoginUserDto) {
        const user = await this.userService.findOne({ email: loginUserDto.email });

        if (!user) {
            throw new BadRequestException("Invalid credentials");
        }

        const validPassword = await bcrypt.compare(loginUserDto.password, user.password);
        if (!validPassword) {
            throw new BadRequestException("Invalid credentials");
        }

        const payload = {
            sub: user._id
        }

        const token = await this.jwtService.signAsync(payload);
        return {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            access_token: token,
        }
    }

    async getProfile(userId: string) {
        const user = await this.userService.findOne({ _id: userId });
        if (!user) {
            throw new BadRequestException("User not found");
        }
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
        };
    }
}
