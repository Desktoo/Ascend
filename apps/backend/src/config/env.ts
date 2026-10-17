import { z } from 'zod';
import * as dotenv from 'dotenv';

// Load the local .env file in apps/backend
dotenv.config();

const envSchema = z.object({
  PORT: z.string().optional().default('3000'),
  NODE_ENV: z.string().optional().default('development'),

  // Database & Caching
  MONGODB_URI: z.string(),
  UPSTASH_REDIS_URL: z.string(),
  QUEUE_REDIS_URL: z.string(),

  // Authentication & Secrets
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  BCRYPT_SECRET_PEPPER: z.string(),

  // AWS / DynamoDB
  AWS_REGION: z.string(),
  AWS_IAM_ACCESS_KEY: z.string(),
  AWS_IAM_SECRET_ACCESS_KEY: z.string(),

  // OCI (Oracle Cloud Infrastructure) Storage
  OCI_PRIVATE_KEY: z.string(),
  OCI_TENANCY: z.string(),
  OCI_USER: z.string(),
  OCI_FINGERPRINT: z.string(),
  OCI_REGION: z.string(),
  OCI_NAMESPACE: z.string(),
  OCI_BUCKET_NAME: z.string(),

  // Notifications & Emails
  VAPID_PUBLIC_KEY: z.string(),
  VAPID_PRIVATE_KEY: z.string(),
  RESEND_API: z.string(),

  // OAuth Providers
  GITHUB_AUTH_CLIENT_ID: z.string().optional().default(() => process.env.GH_AUTH_CLIENT_ID || ''),
  GITHUB_AUTH_CLIENT_SECRET: z.string().optional().default(() => process.env.GH_AUTH_CLIENT_SECRET || ''),
  GITHUB_CALLBACK_URL: z.string().optional().default(() => process.env.GH_CALLBACK_URL || ''),
  GH_AUTH_CLIENT_ID: z.string().optional(),
  GH_AUTH_CLIENT_SECRET: z.string().optional(),
  GH_CALLBACK_URL: z.string().optional(),
  GOOGLE_AUTH_CLIENT_ID: z.string().optional().default(''),
  GOOGLE_AUTH_CLIENT_SECRET: z.string().optional().default(''),
  GOOGLE_CALLBACK_URL: z.string().optional().default(''),
});

// Parse and validate process.env
// We cast it so the types flow through securely
export const env = envSchema.parse(process.env);
