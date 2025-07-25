import { Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import env from './env';

const mailSender = nodemailer.createTransport({
    host: env.SMTP_SERVER,
    secure: true,
    debug: true,
    auth: {
        user: env.SMTP_USERNAME,
        pass: env.SMTP_PASSWORD,
    },
});

mailSender.verify((error, success) => {
    if (error) {
        Logger.error("SMTP Connection failed", 'NotificationsMailer')
    } else if (success) {
        Logger.log('Smtp service connected', 'NotificationsMailer');
    }
});



export { mailSender };

