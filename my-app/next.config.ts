// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // any request to /api/*
        destination: "http://localhost:8000/api/:path*", // forward to your backend
      },
    ];
  },
};

module.exports = nextConfig;
