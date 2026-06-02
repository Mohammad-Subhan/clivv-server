import { IsOptional, IsString } from "class-validator";

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
    password: string;
}