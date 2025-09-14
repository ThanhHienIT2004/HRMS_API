import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserAccount } from '@prisma/client';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { compare, hash } from 'bcrypt';
import { LoginResponse } from './models/auth.model';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
) {}

  async register(userData: RegisterDto): Promise<UserAccount> {
    // Kiểm tra email đã tồn tại
    const user = await this.prismaService.userAccount.findUnique({
      where: { email: userData.email },
    });
    if (user) {
      throw new HttpException(
        { message: 'Email đã tồn tại!' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Kiểm tra employee_id có tồn tại hay không
    const employee = await this.prismaService.employee.findUnique({
      where: { employee_id: userData.employee_id },
    });
    if (!employee) {
      throw new HttpException(
        { message: 'Mã nhân viên không tồn tại!' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Mã hóa mật khẩu
    const hashPass = await hash(userData.password, 10);

    // Tạo tài khoản và connect với employee
    return this.prismaService.userAccount.create({
      data: {
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        password: hashPass,
        Employee: {
          connect: { employee_id: userData.employee_id },
        },
      },
    });
  }

  async login(userData: LoginDto): Promise<LoginResponse> {
    //step1: check email
    const user = await this.prismaService.userAccount.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (!user) {
      throw new HttpException(
        { message: 'Không tìm thấy email này!' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    //step2: check password
    const verify = await compare(userData.password, user.password);

    if (!verify) {
      throw new HttpException(
        { message: 'Mật khẩu không đúng!' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    //step3: generate accessToken and refreshToken
    const payload = {
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '1d',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
