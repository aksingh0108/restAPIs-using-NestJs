import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AvatarService } from './services/avatar.service'; 
import { UserSchema } from './schemas/user.schema';
import { HttpModule } from '@nestjs/axios';  // Import HttpModule for HTTP requests

@Module({
  imports: [ 
  HttpModule],
  providers: [UsersService],
  controllers: [UsersController, ],
  exports: [UsersService], // Export  used in other modules
})
export class UsersModule {}


// src/users/users.module.ts
 
 