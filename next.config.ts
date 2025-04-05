/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ das hier deaktiviert den ESLint-Check beim Build
  },
};

export default nextConfig;