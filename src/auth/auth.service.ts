import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './@types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async localSignup(dto: AuthDTO): Promise<Tokens> {
    const hash = await this.hashData(dto.password);
    const user = await this.prismaService.user
      .create({
        data: {
          email: dto.email,
          hash,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken');
        }
        throw error;
      });
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async localSignin(dto: AuthDTO): Promise<Tokens> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }
    const matches = bcrypt.compare(dto.password, user.hash);

    if (!matches) {
      throw new NotFoundException('Invalid email or password');
    }
    const tokens = await this.getTokens(user.id, user.email);
    return tokens;
  }

  async logout() {}

  async refreshTokens() {}

  async updateRtHash(userId: number, rt: string) {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        hashRt: rt,
      },
    });
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'access-secret-key',
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'refresh-secret-key',
          expiresIn: '168h',
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
