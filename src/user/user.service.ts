import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/auth/dto/registerUser.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ) { }

    async findOne(filterQuery: Record<string, any>) {
        return this.userModel.findOne(filterQuery);
    }

    async createUser(registerUserDto: RegisterUserDto) {
        try {
            const user = await this.userModel.create({
                name: registerUserDto.name,
                email: registerUserDto.email,
                password: registerUserDto.password,
            });

            return {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        } catch (error) {
            const e = error as { code?: number };

            const DUPLICATE_KEY_ERROR_CODE = 11000;

            if (e.code === DUPLICATE_KEY_ERROR_CODE) {
                throw new ConflictException("User already exists");
            }

            throw error;
        }
    }
}