"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailingService = exports.mailTypes = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const env_1 = require("../utils/env");
const nodemailer_config_1 = require("../utils/nodemailer.config");
exports.mailTypes = {
    VERIFY_EMAIL_EMAIL: 'verify-email.template.html',
    RESET_PASSWORD_EMAIL: 'reset-password.template.html',
    RESEND_VERIFICATION_CODE: 'resend-verification-code.template.html',
    PROFILE_UPDATE_REMINDER: "profile-update-reminder.template.html",
    CONTACT_ADMIN_EMAIL: "contact-admin-email.template.html"
};
let MailingService = class MailingService {
    async sendMail(mailType, props) {
        try {
            const template = exports.mailTypes[mailType];
            const body = await this.constructMailBody(template, props.values);
            const res = await nodemailer_config_1.mailSender.sendMail({
                from: `Inserjeune <${env_1.default.SMTP_USERNAME}>`,
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
                common_1.Logger.log(`${mailType} sent to ${props.to} ${JSON.stringify(props)}`, 'MailingService');
        }
        catch (error) {
            common_1.Logger.error(error, 'MailingService');
        }
    }
    async constructMailBody(template, props) {
        return new Promise((resolve, reject) => {
            (0, fs_1.readFile)('./templates/' + template, 'utf-8', (err, data) => {
                let body = data;
                if (err) {
                    common_1.Logger.error(err.message, 'MailingService', 'constructMailBody');
                }
                for (const [key, value] of Object.entries(props)) {
                    body = body.replace(`{{${key}}}`, value);
                }
                return resolve(body);
            });
        });
    }
};
exports.MailingService = MailingService;
exports.MailingService = MailingService = __decorate([
    (0, common_1.Injectable)()
], MailingService);
//# sourceMappingURL=mailing.service.js.map