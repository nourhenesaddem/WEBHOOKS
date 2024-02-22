import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    //JwtModule.register({
    //  secret: 'secret',
    //  signOptions: { expiresIn: '1d' }
    //}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions:{expiresIn: '1d'}
      }),
      inject: [ConfigService],
    }),
    PassportModule,
  ],
  controllers: [UserController],
  providers: [UserService,UserModule],
  exports:[UserService]
})
export class UserModule {}
