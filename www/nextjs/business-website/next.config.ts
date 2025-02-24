import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disables strict mode
};

module.exports = {
  output: 'standalone',

  // @ts-expect-error - This package does not have types
  webpack: (config, context) => {
    config.module.rules.push({
      test: /\.node$/,
      loader: "node-loader",
    });
    return config;
  },
}

export default nextConfig;
