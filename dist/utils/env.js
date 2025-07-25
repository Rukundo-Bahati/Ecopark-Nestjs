"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const zod_1 = require("zod");
dotenv.config();
const envSchema = zod_1.default.object({
    PORT: zod_1.default.string(),
    SMTP_SERVER: zod_1.default.string(),
    SMTP_USERNAME: zod_1.default.string(),
    SMTP_PASSWORD: zod_1.default.string(),
    JWT_SECRET: zod_1.default.string(),
    FRONTEND_URL: zod_1.default.string().url(),
    DATABASE_URL: zod_1.default.string(),
    API_URL: zod_1.default.string(),
    NODE_ENV: zod_1.default.string(),
});
const env = envSchema.parse({ ...process.env });
exports.default = env;
//# sourceMappingURL=env.js.map