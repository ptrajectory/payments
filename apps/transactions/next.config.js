/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "images.pexels.com",
        pathname: "/**",
        protocol: "https",
        port: "",
      },
      {
        hostname: "res.cloudinary.com",
        pathname: "/**",
        protocol: "https",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig
