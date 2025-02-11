import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
      ) {}

     async validateUser(email: string, pass: string): Promise<User | null>{
        const user = await this.usersService.findOne(email);
        if (user && await bcrypt.compare(pass, user.password)) {
          return user;
        }
        return null;
      }

      async login(user: any) {
        const payload = { username: user.username, sub: user.id, role: user.role };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
    
      async register(userData: Partial<User>): Promise<User> {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        return this.usersService.create({
          ...userData,
          password: hashedPassword,
        });
      }
}
