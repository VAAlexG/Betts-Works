import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Stock photography is already served in production-ready sizes and brand
  // artwork is bundled locally. Serving both directly avoids a dependency on
  // the optional Cloudflare Images transformation binding.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
