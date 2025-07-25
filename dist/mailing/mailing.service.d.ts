export declare const mailTypes: {
    readonly VERIFY_EMAIL_EMAIL: "verify-email.template.html";
    readonly RESET_PASSWORD_EMAIL: "reset-password.template.html";
    readonly RESEND_VERIFICATION_CODE: "resend-verification-code.template.html";
    readonly PROFILE_UPDATE_REMINDER: "profile-update-reminder.template.html";
    readonly CONTACT_ADMIN_EMAIL: "contact-admin-email.template.html";
};
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
export declare class MailingService {
    sendMail(mailType: MailType, props: ISendMailProps): Promise<void>;
    private constructMailBody;
}
