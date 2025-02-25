/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/btc/:path*",
        destination: "http://localhost:18443/:path*",
      },
      {
        source: "/api/btc/wallet/:wallet*",
        destination: "http://localhost:18443/wallet/:wallet*",
      },
      {
        source: "/api/stx/v2/contracts/call-read",
        destination: "http://localhost:3999/v2/contracts/call-read",
      },
      {
        source: "/api/stx/:path*",
        destination: "http://localhost:3999/v2/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
