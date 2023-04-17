/** @type {import('next').NextConfig} */
const nextConfig = {
  exportTrailingSlash: true,
  reactStrictMode: true,
  images: {
    loader: 'akamai',
    path: '',  },
};

module.exports = nextConfig;
