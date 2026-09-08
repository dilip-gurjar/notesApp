import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';
import { CreateNoteDto } from 'src/note/dto/createNote.dto';

@Injectable()
export class PrismaService extends PrismaClient{
    create(createNoteDto: CreateNoteDto) {
        throw new Error('Method not implemented.');
    }
    constructor(){
        
        const adapter=new PrismaPg({
            connectionString:process.env.DATABASE_URL as string,
        });
        super({adapter});
    }
}
