import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
// import { RegisterDto } from '../templates/welcome.html';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerSevice: MailerService, // Inject the MailerService
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }

    // has password hashing logic here if needed
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: registerDto.role || Role.MEMBER, //
      },
    });

    // Read the HTML template file
    // const templatePath = path.join(
    //   __dirname,
    //   '..',
    //   'templates',
    //   'welcome.html',
    // );
    // let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

    // Replace the placeholder with the user's name
    // htmlTemplate = htmlTemplate.replace('{{userName}}', name);

    // 2. Call the email service after successful creation
    await this.mailerSevice.sendMail({
      to: user.email,
      subject: `Welcome to Our App! ${user.name}`,
      // html: htmlTemplate,
      // html: '<h1>Thank you for registering!</h1>',
      html: '<h1>Thank you for registering!</h1>',
    });
    const { password: _, ...result } = user; // Exclude password from the result
    return result;
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password: _, ...result } = user; // Exclude password from the result
    return result;
  }

  async login(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
