import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction } from "express";


@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = (req.headers as any)?.authorization?.split(' ')[1];
    if (token) {
      const { organizationId } = this.jwtService.verify(token);
      req['organizationId'] = organizationId; // Attach organizationId to the request object
    }
    next();
  }
  //use(req: Request, res: Response, next: NextFunction) {
  //  const token = req.headers.authorization?.split(' ')[1];
  //  if (token) {
  //    try {
  //      const payload = this.jwtService.verify(token);
  //      req['organizationId'] = payload.organizationId;
  //    } catch (error) {
  //      // Handle JWT verification error
  //      console.error('JWT verification failed:', error.message);
  //    }
  //  }
  //  next();
  //}
}