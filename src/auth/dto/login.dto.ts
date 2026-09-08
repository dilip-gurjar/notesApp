import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto{
   
   

    @IsString()
    email:string;

    @IsNotEmpty()
    password:string;
}