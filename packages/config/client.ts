// packages/config/client.ts
import { z } from 'zod';

// Only define variables that are safe for the browser
const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string(),
  // If VAPID_PUBLIC_KEY is meant for the browser, it needs the NEXT_PUBLIC_ prefix:
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string(), 
});

// Next.js requires us to explicitly write out process.env.NEXT_PUBLIC_... 
// because it replaces them with static strings at build time.
export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
});