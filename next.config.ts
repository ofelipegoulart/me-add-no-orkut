import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) return [];
    // O backend guarda os avatares como arquivos e retorna URLs relativas
    // (/uploads/avatars/...). Reencaminhamos essas requisições para o backend,
    // que serve /uploads/** publicamente.
    return [
      {
        source: '/uploads/:path*',
        destination: `${apiUrl}/uploads/:path*`,
      },
    ];
  },
};



export default nextConfig;
