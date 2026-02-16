/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "anpc.ro",
      },
      {
        protocol: "https",
        hostname: "ec.europa.eu",
      },
    ],
  },
};

export default nextConfig;
