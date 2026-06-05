import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/football/:path*',
        destination: 'https://api.football-data.org/v4/:path*',
      },
    ];
  },
};

export default nextConfig;
