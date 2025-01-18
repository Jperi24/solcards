/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      appDir: true
    },
    images: {
      domains: ['localhost'],
      unoptimized: true,
    }
  }
  
  module.exports = nextConfig