
import { Injectable, } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UsersService {
  private readonly apiUrl = 'https://reqres.in/api/users';

  constructor(private readonly httpService: HttpService) {}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const response: AxiosResponse<any> = await this.httpService.post(this.apiUrl, createUserDto).toPromise();
    return response.data;
  }

  async getUserById(userId: number): Promise<any> {
    const url = `${this.apiUrl}/${userId}`;
    const response: AxiosResponse<any> = await this.httpService.get(url).toPromise();
    return response.data;
  }
}
