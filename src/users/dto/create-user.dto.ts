 
export class CreateUserDto {
    readonly email: string;
    readonly first_name: string;
    readonly last_name: string;
    readonly avatar: string;
  }
  
  // src/users/dto/user.dto.ts

  import { Schema, Document } from 'mongoose';

  export const UserSchema = new Schema({
    email: String,
    first_name: String,
    last_name: String,
    avatar: String,
    avatarHash: String,
  });
  
  export interface User extends Document {
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
    avatarHash: string;
  }