import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NoteModule } from './note/note.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CacheModule } from '@nestjs/cache-manager';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BullModule } from '@nestjs/bullmq';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [BullModule.forRoot({
    connection: {
      host: 'localhost',
      port: 6379,
      password: 'secret',
    },
  }),
  ServeStaticModule.forRoot({
    rootPath: join(process.cwd(), 'uploads'),
    serveRoot: '/uploads',
  }),
  CacheModule.register({
    isGlobal: true,
    ttl: 60,
  }),
  EventEmitterModule.forRoot(),ConfigModule.forRoot({ isGlobal: true }),
  PrismaModule, AuthModule, UserModule, NoteModule, MailModule],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
