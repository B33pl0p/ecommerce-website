/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          // Apply the header to all routes
          source: '/(.*)',
          headers: [
            {
              key: 'Permissions-Policy',
              value: 'camera=()', // Allow camera access
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;