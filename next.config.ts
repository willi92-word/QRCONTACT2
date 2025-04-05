/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ ESLint beim Build ignorieren (optional)
  },
  output: "standalone", // ✅ wichtig für z. B. Render-Deployments
  experimental: {
    serverActions: true,
    appDir: true, // ✅ für App Router erforderlich!
  },
};

export default nextConfig;