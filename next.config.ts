import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output para deploy Docker/EasyPanel
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: '**.dropboxusercontent.com' },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Ignorar erros de TS no build para economizar RAM no servidor
  typescript: {
    ignoreBuildErrors: true,
  },

  // Headers de cache para assets estáticos
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // Compressão habilitada
  compress: true,

  // Desabilitar x-powered-by por segurança
  poweredByHeader: false,
};

export default nextConfig;
