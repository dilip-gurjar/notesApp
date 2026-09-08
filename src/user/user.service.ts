import { Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor( private readonly prismaService:PrismaService){}

    // user is find by his email

    async getUserByEmail(email:string){
       const user= await this.prismaService.user.findFirst({where:{email}})
        return user; 
    }


    //  user is created here 

    async createUser(registerDto:RegisterDto){
     const user= await this.prismaService.user.create({data:registerDto});
     return user;
    }
}
