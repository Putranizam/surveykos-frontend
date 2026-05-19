import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output untuk production - penting untuk Infinity Hosting
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,
  
  // Dev origins untuk development lokal
  ...(process.env.NODE_ENV !== "production" && {
    allowedDevOrigins: ["192.168.1.38", "10.200.239.135", "192.168.1.19", "192.168.1.2"],
  }),
};

export default nextConfig;
