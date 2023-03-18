import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { RoleGuard } from './common/guards';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
  ],

  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: RoleGuard,
  //   },
  // ],
})
export class AppModule {}
