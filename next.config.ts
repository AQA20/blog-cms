import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_ENV: process.env.NEXT_PUBLIC_NEXT_ENV,
    WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd279et700s7bw3.cloudfront.net',
        pathname: '**',
      },
      { protocol: 'https', hostname: 'pbs.twimg.com', pathname: '**' },
      { protocol: 'https', hostname: 'abs.twimg.com', pathname: '**' },
    ],
  },
  reactStrictMode: process.env.NODE_ENV !== 'production',
};

export default nextConfig;
