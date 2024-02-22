import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards
} from "@nestjs/common";
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UserService } from "../user/user.service";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService : AuthService) {}


  //@Post('login')
  //@UseGuards(LocalGuard)
  //login(@Req() req: Request) {
  //  return req.user;
  //}

  @Post('login')
  //@UseGuards(LocalGuard)
  login(@Body() authPayloadDto:AuthPayloadDto) {
    const user = this.authService.validateUser(authPayloadDto);
    if (!user) throw new HttpException('Invalid Credentials', 401);
    return user;
  }


  @Get('status')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    console.log('Inside AuthController status method');
    console.log(req.user);
    return req.user;
  }

  //@HttpCode(HttpStatus.OK)
  //@Post('login')
  //signIn(@Body() signInDto: Record<string, any>) {
  //  return this.authService.validateUser(signInDto.email, signInDto.password);
  //}
}
