import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports:[ 
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    JwtModule.register({
      secret: 'JWT_SECRET', 
      signOptions: { expiresIn: '1h' },
    }),],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy],
  exports:[PassportModule,JwtModule]
  
})
export class AuthModule {

}
