import { CreateNoteDto } from "./createNote.dto";
import {PartialType}from '@nestjs/mapped-types';

export class UpdateNoteDto extends PartialType(CreateNoteDto){
    
}



