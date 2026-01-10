import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
        pathname: '/media/**',
      },
    ],
  },
  // ESLint configuration for builds
  // TODO: Set ignoreDuringBuilds to false once all warnings are fixed
  // Current warnings: curly braces, any types, unused vars
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['src'],
  },
  // TypeScript errors should block builds
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
