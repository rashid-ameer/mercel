// next.config.js
const nextConfig = {
  experimental: {
    staleTimes: { dynamic: 30 },
  },
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ufs.sh", // Wildcard subdomain
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/**`, // ** for deep paths
      },
    ],
  },
  rewrites: () => [{ source: "/hashtag/:tag", destination: "/search?q=%23:tag" }],
};

export default nextConfig;