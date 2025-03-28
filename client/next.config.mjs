/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: "/api/upload",
          destination: "https://ecospark-billupload.onrender.com/upload",
        },
      ];
    },
  };
  
  export default nextConfig;