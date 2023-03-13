import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('/local/signup')
  localSignup() {}

  @Post('/local/signin')
  localSignin() {}

  @Post('/logout')
  logout() {}

  @Post('/refresh')
  refreshTokens() {}
}
