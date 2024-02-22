import {
  Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Res, Req, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from "./user.service";
import { Response,Request } from "express";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
              private jwtService: JwtService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  async login ( @Body('email') email: string,
                @Body('password') password: string,
                @Res({passthrough:true}) response:Response){

    const user = await this.userService.findByEmail(email);

    if (!user){
      throw new BadRequestException('Invalid credentials');
    }
    if(!await bcrypt.compare(password,user.password)){
      throw new BadRequestException('Invalid credentials');
    }
    const jwt = await this.jwtService.signAsync({id: user.userId});
    response.cookie('jwt', jwt,{httpOnly:true});

    return { message:'success' };

  }
  @Get('getuser')
  async getCookies(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];
      if (!cookie) {
        throw new UnauthorizedException('JWT token is missing');
      }
      // Verify and decode the JWT token
      const data = await this.jwtService.verifyAsync(cookie);

      // Retrieve user data based on organizationId
      const user = await this.userService.findOne({ where: { id:data['organizationId'] } });

      if (!data) {
        throw new UnauthorizedException('User not found');
      }
      const {password, ...result} = user;
      return result;
    } catch (error) {
      throw new UnauthorizedException('Failed to authenticate user');
    }
  }

  @Post('logout')
  async logout(@Res({passthrough:true})response:Response){
    response.clearCookie('jwt');

    return {
      message: 'success'
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

}

  //@Get('getuser')
  //async getCookies(@Req() request: Request) {
  //  //try {
  //    const cookie = request.cookies["jwt"];
  //    const data = await this.jwtService.verifyAsync(cookie);
  //    //return data ;
  //    //if(!data) {
  //    //  throw new UnauthorizedException();
  //    //}
  //    const organizationId = data.organizationId;
  //    const user = await this.userService.findOne({ id: organizationId });
  //    return user;
  //  //}
  //  //catch (e) {
  //  //  throw new UnauthorizedException();
  //  //}
  //}


    //how to handle error cases gracefully
    //and secure my application against common
    //security threats such as CSRF
    //(Cross-Site Request Forgery) attacks !!