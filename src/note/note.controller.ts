import { Body, Controller, Post, UseGuards ,Request, Get, Param, Query, ParseIntPipe, ParseArrayPipe, Patch, Delete} from '@nestjs/common';
import { CreateNoteDto } from './dto/createNote.dto';
import { NoteService } from './note.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateNoteDto } from './dto/updateNote.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors,UploadedFile,} from '@nestjs/common';
import { diskStorage } from 'multer';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { PrivilegesGuard } from 'src/common/guards/privileges.guard';
import { Privileges } from 'src/common/decorators/privileges.decorator';
import { Privilege } from 'src/common/enums/privilege.enum';



@Controller('api/notes')
// @Roles(Role.ADMIN)
export class NoteController {
    constructor(private readonly noteService:NoteService){}



    @Get('admin-test')
    @UseGuards(AuthGuard)
    // @Roles(Role.ADMIN)
    adminTest() {
      return {
        message: 'Welcome Admin',
      };
    }
    




    @UseGuards(AuthGuard,PrivilegesGuard)
    @Privileges(Privilege.CREATE_NOTE)
    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
          storage: diskStorage({
            destination: './uploads',
      
            filename: (req, file, cb) => {
              const fileName = Date.now() + '-' + file.originalname;
      
              cb(null, fileName);
            },
          }),
        }),
      )


    create(
    @Body()createNoteDto:CreateNoteDto,
    @UploadedFile()
    file: Express.Multer.File,
    @Request() req:{user:{sub:number}}){
        // console.log(file);
        return this.noteService.create(createNoteDto,req.user.sub,file,)
    }



    @Get()
    @UseGuards(AuthGuard, PrivilegesGuard)
    @Privileges(Privilege.READ_NOTE)
    findAll(@Request() req:{user:{sub:number}},@Query('take',new ParseIntPipe({optional:true}))take?:number, @Query('skip',new ParseIntPipe({optional:true}))skip?:number,)
    {
        
    return this.noteService.findAll({take:take||10, skip:skip||0},req.user.sub);
}


@Get(':id')
@UseGuards(AuthGuard)
findOne(@Param('id',ParseIntPipe)id:number,@Request() req:{user:{sub:number}},){
return this.noteService.findOne(id,req.user.sub);
}


@Patch(':id')
@UseGuards(AuthGuard,PrivilegesGuard)
@Privileges(Privilege.UPDATE_NOTE)
update(
@Param('id',ParseIntPipe)id:number,
@Body()updateNoteDto:UpdateNoteDto,
@Request() req:{user:{sub:number}}){
    return this.noteService.update(id,updateNoteDto,req.user.sub)
}


@Delete(':id')
@UseGuards(AuthGuard,PrivilegesGuard)
@Privileges(Privilege.DELETE_NOTE)
// @Roles(Role.ADMIN)
remove(
@Param('id',ParseIntPipe) id:number,
@Request() req:{user:{sub:number}}){
    return this.noteService.remove(id,)
}





//  test apis 

// @Get('admin-test')
// @UseGuards(AuthGuard, RolesGuard)
// @Roles(Role.ADMIN)
// adminTest() {
//   return {
//     message: 'Welcome Admin',
//   };
// }

}


// 