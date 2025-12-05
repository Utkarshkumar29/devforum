/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "static.vecteezy.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },

  // -------------------------------
  // 🚀 BYPASS TYPESCRIPT ERRORS
  // -------------------------------
  typescript: {
    ignoreBuildErrors: true,
  },

  // -------------------------------
  // 🚀 BYPASS ESLint ERRORS
  // -------------------------------
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
