import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from "./dto/auth.dto";
import { UserService } from "../user/user.service";
@Injectable()
export class AuthService {
  constructor(
              private userService: UserService,
              private jwtService: JwtService) {}

  //validateUser(email:string, password: string) {
  //  const findUser = User.find((user) => user.email === email);
  //  if (!findUser) return null;
  //  if (password === findUser.password) {
  //    const { password, ...user } = findUser;
  //    return this.jwtService.sign(user);
  //  }
  //}
  async validateUser({ email,password }: AuthPayloadDto): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found !');
    }
    if (password !== user.password) {
      throw new UnauthorizedException('Invalid password!');
    }
    const { password: _, ...userData } = user;
    return this.jwtService.sign(userData);
  }

  decodeToken(token: string): any {
    try {
      const decodedToken = this.jwtService.verify(token);
      return decodedToken;
    } catch (error) {
      // Handle invalid tokens or token expiration
      throw new Error('Invalid token');
    }
  }

}