import * as dotenv from 'dotenv';
import z from 'zod';
dotenv.config();

const envSchema = z.object({
  PORT: z.string(),
  SMTP_SERVER: z.string(),
  SMTP_PORT: z.string(),
  SMTP_USERNAME: z.string(),
  SMTP_PASSWORD: z.string(),
  JWT_SECRET: z.string(),
  FRONTEND_URL: z.string().url(),
  DATABASE_URL: z.string(),
  API_URL: z.string(),
  NODE_ENV: z.string(),
});

const env = envSchema.parse({ ...process.env });
export default env;
