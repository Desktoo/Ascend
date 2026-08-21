// apps/web/next.config.mjs
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the root .env
dotenv.config({ path: path.resolve(__dirname, "../../.env"), override: true });

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly tell Next.js to inject these keys into the build pipeline
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  },
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: "http://localhost:3000/auth/:path*",
      },
      {
        source: "/health/:path*",
        destination: "http://localhost:3000/health/:path*",
      },
    ];
  },
};

export default nextConfig;