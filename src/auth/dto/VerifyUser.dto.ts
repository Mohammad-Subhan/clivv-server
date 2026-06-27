import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class VerifyUserDto {
    @IsNotEmpty({ message: "Email is required" })
    @IsEmail({}, { message: "Invalid email address" })
    email: string;

    @IsNotEmpty({ message: "Password is required" })
    @IsString()
    password: string;
}