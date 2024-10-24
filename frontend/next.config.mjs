/** @type {import('next').NextConfig} */
import { createProxyMiddleware } from 'http-proxy-middleware';

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*', // Proxy to your API server
      },
    ];
  },
};

export default nextConfig;
