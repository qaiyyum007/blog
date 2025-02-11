import { User, UserRole } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor (@InjectRepository(User) private readonly repositry :Repository<User>){

  }
  create(createUserDto: CreateUserDto) :Promise<User>{
    const user = this.repositry.create(createUserDto);  
    return this.repositry.save(user);
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.repositry.findOne({ where: { username } });
  }

  async findAll(): Promise<User[]> {
    return this.repositry.find();
  }

  async deleteUser(id: number) {
    await this.repositry.delete(id);
    return { message: 'User deleted successfully' };
  }

  async updateUser(id: number, userData: Partial<{ username: string; password: string; role: UserRole }>) {
    const user = await this.repositry.findOne({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    await this.repositry.update(id, userData);
    return { message: 'User updated successfully' };
  }
}
