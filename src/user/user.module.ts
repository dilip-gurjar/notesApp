import { Module } from '@nestjs/common';
import { UserService } from './user.service';
// import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  exports:[UserService],
  providers: [UserService]
})
export class UserModule {}
