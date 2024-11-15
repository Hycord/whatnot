/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/api/ocr',
            destination: 'http://localhost:9292/ocr'
          },
        ]
      },
};

export default nextConfig;
