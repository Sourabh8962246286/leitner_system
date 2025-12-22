import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id.toString() };
    
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
    const refreshExpiresIn = this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION_TIME');

    if(!refreshSecret || !refreshExpiresIn) {
      throw new Error('JWT Refresh token configuration is missing in environment variables.');
    }

    const refreshOptions: JwtSignOptions = {
        secret: refreshSecret,
        expiresIn: +refreshExpiresIn,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, refreshOptions),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findOne(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    // We can add a similar check for phone number if needed

    const user = await this.usersService.create(registerDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user.toObject();
    return result;
  }

  async refreshTokens(userId: string, email: string) {
    const payload = { email, sub: userId };
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      access_token: accessToken,
    };
  }
}
