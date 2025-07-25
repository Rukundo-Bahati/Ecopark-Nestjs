"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailSender = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const env_1 = require("./env");
const mailSender = nodemailer.createTransport({
    host: env_1.default.SMTP_SERVER,
    secure: true,
    debug: true,
    auth: {
        user: env_1.default.SMTP_USERNAME,
        pass: env_1.default.SMTP_PASSWORD,
    },
});
exports.mailSender = mailSender;
mailSender.verify((error, success) => {
    if (error) {
        common_1.Logger.error("SMTP Connection failed", 'NotificationsMailer');
    }
    else if (success) {
        common_1.Logger.log('Smtp service connected', 'NotificationsMailer');
    }
});
//# sourceMappingURL=nodemailer.config.js.map