import { IsNotEmpty, IsString } from "class-validator";

export class RevealSecretDto {
    @IsNotEmpty({ message: "masterPassword is required" })
    @IsString()
    masterPassword: string;

    @IsNotEmpty({ message: "Secret ID is required" })
    @IsString()
    id: string;
}