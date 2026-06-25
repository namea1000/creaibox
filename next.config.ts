import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/supabase/:path*",
        destination: "https://dkblalbnykgpksurdace.supabase.co/:path*",
      },
    ];
  },
};

export default nextConfig;
