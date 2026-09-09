import dotenv from "dotenv";
import path from "node:path";
import { z } from 'zod';
import { fileURLToPath } from "node:url";

const envSchema = z.object({
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  BCRYPT_SECRET_PEPPER: z.string(),
  DATABASE_URL: z.string(),
  NODE_ENV: z.string(),
  UPSTASH_REDIS_URL: z.string(),
  GOOGLE_AUTH_CLIENT_ID: z.string(),
  GOOGLE_AUTH_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),
  GITHUB_AUTH_CLIENT_ID: z.string(),
  GITHUB_AUTH_CLIENT_SECRET: z.string(),
  GITHUB_CALLBACK_URL: z.string(),
  RESEND_API: z.string(),
  NEXT_PUBLIC_API_URL: z.string(),
  AWS_IAM_ACCESS_KEY: z.string(),
  AWS_IAM_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  QUEUE_REDIS_URL: z.string(),
  MONGODB_URI: z.string(),
  VAPID_PUBLIC_KEY: z.string(),
  VAPID_PRIVATE_KEY: z.string(),
  OCI_TENANCY: z.string(),
  OCI_USER: z.string(),
  OCI_FINGERPRINT: z.string(),
  OCI_REGION: z.string(),
  OCI_NAMESPACE: z.string(),
  OCI_BUCKET_NAME: z.string(),
  OCI_PRIVATE_KEY: z.string(),
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootEnvPath = path.resolve(__dirname, "../../.env");

dotenv.config({
  path: rootEnvPath,
  override: false,
});



export const env = envSchema.parse(process.env);
