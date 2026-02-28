/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      '@chakra-ui/react',
      'lucide-react',
      'framer-motion',
      'react-icons',
      'react-select',
      'world-countries',
      '@emotion/react',
      '@emotion/styled',
    ],
    optimizeCss: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
};

export default nextConfig;
