/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Permissions-Policy",
              value: "camera=*, microphone=*, geolocation=*", // Allow camera access
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  