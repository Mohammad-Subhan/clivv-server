import { IsNotEmpty, IsString } from "class-validator";

export class CreateSecretDto {
    @IsNotEmpty({ message: "Secret name is required" })
    @IsString()
    name: string;

    @IsNotEmpty({ message: "Website is required" })
    @IsString()
    website: string;

    @IsNotEmpty({ message: "Username is required" })
    @IsString()
    username: string;

    @IsNotEmpty({ message: "Encrypted password is required" })
    @IsString()
    encryptedPassword: string;

    @IsNotEmpty({ message: "IV is required" })
    @IsString()
    iv: string;

    @IsNotEmpty({ message: "Auth tag is required" })
    @IsString()
    authTag: string;
}