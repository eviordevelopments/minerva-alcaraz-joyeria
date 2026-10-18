import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/inicio',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/tienda',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/catalogo',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/productos',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/joyeria',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/joyas',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/piezas',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/boutique',
        destination: '/#boutiques',
        permanent: true,
      },
      {
        source: '/boutiques',
        destination: '/#boutiques',
        permanent: true,
      },
      {
        source: '/puntos-de-venta',
        destination: '/#boutiques',
        permanent: true,
      },
      {
        source: '/historia',
        destination: '/nuestra-historia',
        permanent: true,
      },
      {
        source: '/circle',
        destination: '/the-circle',
        permanent: true,
      },
      {
        source: '/tallas',
        destination: '/guia-de-tallas',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
