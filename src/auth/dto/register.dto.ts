import { IsNotEmpty, IsString } from "class-validator";

export class RegisterDto{
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    email:string;

    @IsNotEmpty()
    password:string;
}