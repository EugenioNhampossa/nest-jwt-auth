import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Tokens } from './@types';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  localSignup(@Body() dto: AuthDTO): Promise<Tokens> {
    return this.authService.localSignup(dto);
  }

  @Post('/local/signin')
  @HttpCode(HttpStatus.OK)
  localSignin(@Body() dto: AuthDTO): Promise<Tokens> {
    return this.authService.localSignin(dto);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-access'))
  logout(@Req() req: Request) {
    const user = req.user;
    return this.authService.logout(user['sub']);
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  refreshTokens(@Req() req: Request): Promise<Tokens> {
    const user = req.user;
    return this.authService.refreshTokens(user['sub'], user['refreshToken']);
  }
}
