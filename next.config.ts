import type { NextConfig } from "next";

function getSupabaseImagePatterns() {
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
    {
      protocol: "https",
      hostname: "images.unsplash.com",
    },
  ];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (url) {
    try {
      const hostname = new URL(url).hostname;
      patterns.push({
        protocol: "https",
        hostname,
        pathname: "/storage/v1/object/public/**",
      });
    } catch {
      // ignore invalid URL
    }
  }

  // Fallback for known project during local dev without env
  patterns.push({
    protocol: "https",
    hostname: "fcpsafjgjnecdlyqfcid.supabase.co",
    pathname: "/storage/v1/object/public/**",
  });

  return patterns;
}

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: getSupabaseImagePatterns(),
  },
  async redirects() {
    return [
      {
        source: "/anunturi",
        destination: "/proprietati",
        permanent: true,
      },
      {
        source: "/anunturi/:slug",
        destination: "/proprietati/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
