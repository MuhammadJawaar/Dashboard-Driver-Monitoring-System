/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "www.automateexcel.com",
          },
        ],
      },
};

export default nextConfig;
