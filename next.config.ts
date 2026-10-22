import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ["src/stories"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
        port: "",
      },
      {
        protocol: "https",
        hostname: "downloads.ctfassets.net",
        port: "",
      },
    ],
    dangerouslyAllowSVG: true,
  },
  webpack: (config) => {
    // pdf.js ships pdf.mjs as a webpack bundle whose runtime globals collide
    // with Next.js' webpack runtime; the minified build avoids them.
    config.resolve.alias["pdfjs-dist$"] = path.join(
      process.cwd(),
      "node_modules/pdfjs-dist/build/pdf.min.mjs",
    );
    return config;
  },
  async redirects() {
    return [
      {
        // Legacy PDF Document download links
        source: "/api/pdf/:slug",
        destination: "/api/resources/:slug/download",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
