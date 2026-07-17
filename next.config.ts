import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiUrl = process.env.API_URL;
    const backendUrl = process.env.BACKEND_URL;
    if (!apiUrl) return [];
    // O backend guarda os avatares como arquivos e retorna URLs relativas
    // (/uploads/avatars/...). Reencaminhamos essas requisições para o backend,
    // que serve /uploads/** publicamente.
    return [
      {
        source: '/uploads/:path*',
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
};



export default nextConfig;
