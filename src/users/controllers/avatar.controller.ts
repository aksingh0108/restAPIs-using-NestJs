import { Controller, Get, Delete, Param } from '@nestjs/common';
import { AvatarService } from '../services/avatar.service';

@Controller('users')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @Get(':userId/avatar')
  async getAvatar(@Param('userId') userId: string) {
    return this.avatarService.getAvatar(userId);
  }

  @Delete(':userId/avatar')
  async deleteAvatar(@Param('userId') userId: string) {
    await this.avatarService.deleteAvatar(userId);
    return { message: 'Avatar deleted successfully' };
  }
}
