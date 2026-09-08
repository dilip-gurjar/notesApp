import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('api') //auth
export class AuthController {
constructor(private readonly authService:AuthService){}

// this is main register method to register both user and admin
    @Post('register')
    register(@Body()registerDto:RegisterDto){
        return this.authService.register(registerDto)
    }

// this is login method for user and admin
    @Post('login')
    login(@Body() loginDto:LoginDto){
  return this.authService.login(loginDto);
    }

}
