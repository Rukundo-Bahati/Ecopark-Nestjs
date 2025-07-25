import { Injectable, Logger } from '@nestjs/common';
import { readFile } from 'fs';
import env from 'src/utils/env';
import { mailSender } from 'src/utils/nodemailer.config';

export const mailTypes = {
    VERIFY_EMAIL_EMAIL: 'verify-email.template.html',
    RESET_PASSWORD_EMAIL: 'reset-password.template.html',
    RESEND_VERIFICATION_CODE: 'resend-verification-code.template.html',
    PROFILE_UPDATE_REMINDER: "profile-update-reminder.template.html",
    CONTACT_ADMIN_EMAIL: "contact-admin-email.template.html"
} as const;


export type MailType = keyof typeof mailTypes;


export interface ISendMailProps {
    to: string;
    subject: string;
    values: Record<string, string>;
    attachments?: {
        filename: string;
        content: string | Buffer;
    }[];
}
@Injectable()
export class MailingService {
    async sendMail(mailType: MailType, props: ISendMailProps) {
        try {

            const template = mailTypes[mailType];

            const body = await this.constructMailBody(template, props.values);
            const res = await mailSender.sendMail({
                from: `Inserjeune <${env.SMTP_USERNAME}>`,
                to: props.to,
                subject: props.subject,
                html: body,
                attachments: props.attachments?.map((a) => ({
                    content: a.content,
                    filename: a.filename,
                    contentType: 'base64',
                })),
            });
            if (res.accepted)
                Logger.log(
                    `${mailType} sent to ${props.to} ${JSON.stringify(props)}`,
                    'MailingService',
                );
        } catch (error) {
            Logger.error(error, 'MailingService');
        }
    }

    private async constructMailBody(
        template: string,
        props: Record<string, string>,
    ) {
        return new Promise<string>((resolve, reject) => {
            readFile(
                './templates/' + template ,
                'utf-8',
                (err, data) => {
                    let body = data;
                    if (err) {
                        Logger.error(err.message, 'MailingService', 'constructMailBody');
                    }
                    for (const [key, value] of Object.entries(props)) {
                        body = body.replace(`{{${key}}}`, value);
                    }
                    return resolve(body);
                },
            );
        });
    }

}
