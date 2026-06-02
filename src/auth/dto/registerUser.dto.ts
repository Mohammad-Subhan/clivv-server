import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class RegisterUserDto {
    @IsNotEmpty({ message: "Name is required" })
    @IsString()
    name: string;

    @IsEmail({}, { message: "Invalid email" })
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @IsNotEmpty({ message: "Password is required" })
    @IsString()
    @MinLength(6, { message: "Password must be at least 6 characters long" })
    password: string;
}