/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  output: 'standalone',
  images: {
    loader: 'akamai',
    path: '',  },
};

module.exports = nextConfig;
