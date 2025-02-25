/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/btc/:path*",
        destination: "http://localhost:18443/:path*",
      },
      {
        source: "/api/stx/:path*",
        destination: "http://localhost:20443/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
