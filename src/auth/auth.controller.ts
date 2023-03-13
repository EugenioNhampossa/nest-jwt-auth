import { Body, Controller, Post } from '@nestjs/common';
import { Tokens } from './@types';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/local/signup')
  localSignup(@Body() dto: AuthDTO): Promise<Tokens> {
    return this.authService.localSignup(dto);
  }

  @Post('/local/signin')
  localSignin(@Body() dto: AuthDTO): Promise<Tokens> {
    return this.authService.localSignin(dto);
  }

  @Post('/logout')
  logout() {
    return this.authService.logout();
  }

  @Post('/refresh')
  refreshTokens() {
    return this.authService.refreshTokens();
  }
}
