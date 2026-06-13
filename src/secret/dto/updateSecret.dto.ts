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
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    masterPassword: string;
}