/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
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