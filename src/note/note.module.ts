import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { NoteProcessor } from './note.processor';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports:[PrismaModule,
    BullModule.registerQueue({
      name: 'photo-processing',
    }),
    MailModule,
    ],
  controllers: [NoteController],
  providers: [NoteService,PrismaModule,  NoteProcessor,]
})
export class NoteModule {}
