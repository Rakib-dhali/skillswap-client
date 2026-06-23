/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows any HTTPS domain
      },
      {
        protocol: 'http',
        hostname: '**', // Allows any HTTP domain (optional, but good for local dev/testing)
      },
    ],
  },
};

export default nextConfig;