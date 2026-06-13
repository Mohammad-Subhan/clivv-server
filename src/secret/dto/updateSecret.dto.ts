import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateSecretDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    website: string;

    @IsOptional()
    @IsString()
    username: string;

    @IsOptional()
    @IsString()
    encryptedPassword: string;

    @IsOptional()
    @IsString()
    iv: string;

    @IsOptional()
    @IsString()
    authTag: string;
}