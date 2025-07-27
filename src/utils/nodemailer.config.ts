import { Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import env from './env';

const mailSender = nodemailer.createTransport({
  host: env.SMTP_SERVER, // smtp.mailtrap.io
  port: Number(env.SMTP_PORT), // 587 or 2525
  secure: false, // <-- THIS MUST BE false for Mailtrap
  auth: {
    user: env.SMTP_USERNAME,
    pass: env.SMTP_PASSWORD,
  },
  debug: true,
});

mailSender.verify((error, success) => {
  if (error) {
    Logger.error('SMTP Connection failed', 'NotificationsMailer');
  } else if (success) {
    Logger.log('Smtp service connected', 'NotificationsMailer');
  }
});

export { mailSender };
