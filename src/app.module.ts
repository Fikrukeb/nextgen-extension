import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@mguay/nestjs-better-auth';
import { auth } from '../utils/auth';
import { PrismaService } from './prisma/prisma.service';
@Module({
  imports: [AuthModule.forRoot(auth), AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
