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
  output: "standalone",
};

export default nextConfig;
