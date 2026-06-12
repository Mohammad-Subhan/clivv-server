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

    @IsNotEmpty({ message: "Password is required" })
    @IsString()
    password: string;

    @IsNotEmpty({ message: "Master password is required" })
    @IsString()
    masterPassword: string;
}