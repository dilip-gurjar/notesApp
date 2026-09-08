import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,

      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendWelcomeMail(
    email: string,
    noteTitle: string,
  ) {
    await this.transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: 'New Note Created',

      html: `
        <h1>Welcome!</h1>

        <p>Your note has been created successfully.</p>

        <p>
          <strong>Note:</strong> ${noteTitle}
        </p>

        <p>Thank you for using our Notes application.</p>
      `,
    });
  }
}