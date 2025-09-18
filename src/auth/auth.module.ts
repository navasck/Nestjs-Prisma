import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles/roles.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { createTestAccount } from 'nodemailer';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => {
        const testAccount = await createTestAccount();
        return {
          transport: {
            host: 'smtp.gmail.com', // Replace with your SMTP host
            port: 465,
            secure: true, // Use 'true' for 465, 'false' for other ports
            auth: {
              // user: testAccount?.user,
              // pass: testAccount?.pass,
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          },
          defaults: {
            from: '"No Reply" <noreply@myapp.com>',
          },
        };
      },
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
    PrismaModule,
  ],
  providers: [AuthService, JwtAuthGuard, JwtStrategy, RolesGuard],
  controllers: [AuthController],
})
export class AuthModule {}
