import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendInvite(email: string, teamName: string, inviteLink: string) {
    const info = await this.mailerService.sendMail({
      to: email,
      subject: `You have been invited to join ${teamName}`,
      html: `
            <p> Hello! </p>
            <p> You have been invited to join the team : <b> ${teamName} </b>. </p>
            <p> Click below to accept: </p>
            <a href="${inviteLink}"> Accept Invitation </a>
            `,
    });

    console.log('Preview URL', nodemailer.getTestMessageUrl(info));
  }
}
