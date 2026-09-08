/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/createNote.dto';
import { PrismaService } from 'src/prisma/prisma.service';
// import { NotFoundError } from 'rxjs';5
import { UpdateNoteDto } from './dto/updateNote.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';
import type { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class NoteService {
        private logger=new Logger(NoteService.name)
    constructor(
      private readonly mailService: MailService,
      private readonly prismaService:PrismaService, 
      
      
       @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  
    @InjectQueue('photo-processing')
    private readonly photoQueue: Queue,
  ){}

  async create(createNoteDto: CreateNoteDto, userId: number, file: Express.Multer.File){   
    // const note=await this.prismaService.note. create({

      const note = await this.prismaService.$transaction(async (tx) => {
       
        // 1. User se ₹5 atomically deduct
    const result = await tx.user.updateMany({
      where: {
        id: userId,
        balance: {
          gte: 5,
        },
      },
      data: {
        balance: {
          decrement: 5,
        },
      },
    });

    if (result.count === 0) {
      throw new ForbiddenException('Insufficient balance');
    }


            // 4. Admin find karo
    const admin = await tx.user.findUnique({
      where: {
        email: 'admin@gmail.com',
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // 5. Admin ko ₹5 do
    await tx.user.update({
      where: {
        id: admin.id,
      },
      data: {
        balance: {
          increment: 5,
        },
      },
    });



           // 5. Create note

        const note = await tx.note.create({
      data:{
            title:createNoteDto.title,
            body:createNoteDto.body,
            image: file.path,
            userId,
        },
      });
 
      return note;
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    },
  );
  const user = await this.prismaService.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      email: true,
    },
  });
  
  if (user) {
    await this.mailService.sendWelcomeMail(
      user.email,
      note.title,
    );
  }


  await this.photoQueue.add('process-photo', {
    noteId: note.id,
    filePath: file.path,
  });

        await this.cacheManager.clear();
            this.logger.log(`new note has been created ${note.id}`)
            return note;
    }

async findAll({skip , take}:{skip:number,take:number},userId:number){
   // Create a unique cache key for each user and page
  const cacheKey = `notes:${userId}:${skip}:${take}`;
    // Check cache first
  const cachedNotes = await this.cacheManager.get(cacheKey);
  // console.log("Cache Key:", cacheKey);
  // console.log("Cached Notes:", cachedNotes);
  if (cachedNotes) {
    this.logger.log('Returning notes from cache');
    return cachedNotes;
  }

    const allnotes=await this.prismaService.note.findMany({
        skip,
        take,
        where:{
        userId,
    },
});
await this.cacheManager.set(cacheKey, allnotes, 60000);

  this.logger.log('Returning notes from database');

    return allnotes;
}



async findOne(id:number,userId:number){

  const cacheKey = `note:${userId}:${id}`;

  const cachedNote = await this.cacheManager.get(cacheKey);

  if (cachedNote) {
    this.logger.log("Returning single note from cache");
    return cachedNote;
  }
    const note= await this.prismaService.note.findUnique({
        where:{id,}
      }) ;
      if(!note){
        throw new NotFoundException("note is not exist")
      }
      if(note?.userId!==userId){
        throw new ForbiddenException("not allowed")
      }
      await this.cacheManager.set(cacheKey, note,60000);
      const test = await this.cacheManager.get(cacheKey);

      this.logger.log("Returning single note from database");
return note
}


async update(id:number,updateNoteDto:UpdateNoteDto,userId:number){
    
    const note= await this.prismaService.note.findFirst({where:{id},});
    if(!note){
        throw new NotFoundException("note is not exist")
      }
      if(note?.userId!==userId){
        throw new ForbiddenException("not allowed")
      }

      const updated=await this.prismaService.note.update({where:{id,},
    data:updateNoteDto,})
    await this.cacheManager.clear();

    return updated;
}


async remove(id:number,){
   const note= await this.prismaService.note.delete({where:{id,}});
   
   if(!note){
    throw new NotFoundException("note is not exist")
  }
  // if(note?.userId!==userId){
  //   throw new ForbiddenException("not allowed")
  // }
  await this.cacheManager.clear();
return note;

   

}



}
