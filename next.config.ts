/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ ESLint beim Build ignorieren (wie gehabt)
  },
  output: "standalone", // ✅ wichtig für Vercel/Render
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;