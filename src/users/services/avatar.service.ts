import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { User } from '../schemas/user.schema';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AvatarService {
  private readonly avatarDir = './avatars'; // Directory to store avatars

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getAvatar(userId: string): Promise<string> {
    // Fetch user from DB to check if avatar is already saved
    const user = await this.userModel.findOne({ userId }).exec();
    if (user && user.avatarHash) {
      // If avatar hash exists, return the base64 encoded image
      const filePath = path.join(this.avatarDir, user.avatarHash);
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, { encoding: 'base64' });
      }
      throw new NotFoundException('Avatar file not found');
    }

    // Fetch avatar URL from reqres.in
    const url = `https://reqres.in/api/users/${userId}`;
    const response: AxiosResponse<any> = await this.httpService.get(url).toPromise();
    const avatarUrl = response.data.data.avatar;

    // Download and save avatar image
    const avatarResponse = await this.httpService.get(avatarUrl, { responseType: 'arraybuffer' }).toPromise();
    const avatarBuffer = Buffer.from(avatarResponse.data, 'binary');
    const avatarHash = crypto.createHash('sha256').update(avatarBuffer).digest('hex');
    const filePath = path.join(this.avatarDir, avatarHash);

    // Ensure the avatar directory exists
    if (!fs.existsSync(this.avatarDir)) {
      fs.mkdirSync(this.avatarDir);
    }

    fs.writeFileSync(filePath, avatarBuffer);
    
    // Save avatar hash in the database
    await this.userModel.updateOne({ userId }, { avatarHash }, { upsert: true }).exec();

    return avatarBuffer.toString('base64');
  }

  async deleteAvatar(userId: string): Promise<void> {
    const user = await this.userModel.findOne({ userId }).exec();
    if (user && user.avatarHash) {
      const filePath = path.join(this.avatarDir, user.avatarHash);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      await this.userModel.updateOne({ userId }, { $unset: { avatarHash: '' } }).exec();
    } else {
      throw new NotFoundException('Avatar not found');
    }
  }
}
