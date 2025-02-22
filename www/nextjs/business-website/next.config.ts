import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disables strict mode
};

module.exports = {
  output: 'standalone'
}

export default nextConfig;
