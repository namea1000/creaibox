import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/auth/v1/:path*",
        destination: "https://dkblalbnykgpksurdace.supabase.co/auth/v1/:path*",
      },
      {
        source: "/rest/v1/:path*",
        destination: "https://dkblalbnykgpksurdace.supabase.co/rest/v1/:path*",
      },
      {
        source: "/storage/v1/:path*",
        destination: "https://dkblalbnykgpksurdace.supabase.co/storage/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
