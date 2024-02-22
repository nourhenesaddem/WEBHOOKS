import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from "./strategies/local.strategy";
import { UserModule } from "../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";


@Module({
  imports: [
    PassportModule,
    UserModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'nounou',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,JwtStrategy],
  exports: [AuthModule],
})
export class AuthModule {}
