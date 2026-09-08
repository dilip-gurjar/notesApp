import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { Role } from 'src/common/enums/role.enum';
// import { Privileges } from 'src/common/decorators/privileges.decorator';
import { ROLE_PRIVILEGES } from 'src/common/permissions/role-privileges';


@Injectable()
export class AuthService {
  private readonly logger=new Logger(AuthService.name);
    constructor(
      private readonly userService:UserService, 
      private readonly jwtService:JwtService,
      private readonly eventEmitter: EventEmitter2,){}

  async register(registerDto:RegisterDto){
   
const user= await this.userService.getUserByEmail(registerDto.email);
if(user){
    throw new ConflictException("email alredy exist")
}
const hashedPassword= await bcrypt.hash(registerDto.password,10)
// console.log(hashedPassword);

const newUser=await this.userService.createUser({...registerDto, password:hashedPassword});

this.eventEmitter.emit('user.registered', {
  id: newUser.id,
  email: newUser.email,
});

this.logger.log(`new user has been created ${newUser.id}`);



const payload={sub:newUser.id, email: newUser.email,
  roles:[Role.USER],
};
  return{
    access_token:await this.jwtService.signAsync(payload)
  }


   }


// LOGIN 

   async login(loginDto:LoginDto){

    const user=await this.userService.getUserByEmail(loginDto.email);

    if(!user){
      throw new UnauthorizedException("email or password is incorrect");
   
    }

   const match= await bcrypt.compare(loginDto.password,user.password);

   if(!match){
     throw new UnauthorizedException("email or password is incorrect");
   }
   const roles =
      user.email === 'admin@gmail.com'
        ? [Role.ADMIN]
        : [Role.USER];

        const privileges = roles.flatMap(
          role => ROLE_PRIVILEGES[role],
        );
        
   const payload={sub:user.id, email: user.email, roles,privileges};
  return{
    access_token:await this.jwtService.signAsync(payload)
  }
 
   }
}
