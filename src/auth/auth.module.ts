import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserListener } from './user.listener';

@Module({
  imports:[ConfigModule,UserModule,JwtModule.registerAsync({global:true,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.getOrThrow<string>('JWT_SECRET'),

      signOptions: {
        expiresIn:'5h',
      },
    }),
  }),],
  providers: [AuthService,UserListener,],
  controllers: [AuthController]
})
export class AuthModule {}
