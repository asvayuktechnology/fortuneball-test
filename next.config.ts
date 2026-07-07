import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.qrserver.com",
      },
      {
        protocol: "https",
        hostname: "s2.coinmarketcap.com",
        pathname: "/static/img/coins/64x64/**",
      },
      {
        protocol: "https",
        hostname: "api.fortunenft.world",
      },
     
      {
        protocol: "http",
        hostname: "localhost",
        port: "7002",
      },
      {
        protocol: "http",
        hostname: "192.168.1.55",
        port: "7002",
      },

    {
      protocol: "https",
      hostname: "cryptologos.cc",
      pathname: "/logos/**",
    },
    ],
  },
};

export default nextConfig;
