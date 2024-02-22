import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
              private authService: AuthService) {
    super();
  }
  async validate(email: string, password: string): Promise<any> {
    console.log('Inside LocalStrategy');
    try {
      const user = await this.authService.validateUser({ email, password });
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  //async validate(email: string, password: string) {
  //  console.log('Inside LocalStrategy');
  //  const user = this.authService.validateUser({ email,password } );
  //  if (!user) throw new UnauthorizedException();
  //  return user;
  //}
}