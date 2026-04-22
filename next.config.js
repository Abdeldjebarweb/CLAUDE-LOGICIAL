/** @type {import('next').NextConfig} */
const nextConfig = {
  // Désactiver l'affichage des erreurs détaillées en production
  productionBrowserSourceMaps: false,

  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Empêche le site d'être affiché dans une iframe (clickjacking)
          { key: 'X-Frame-Options', value: 'DENY' },
          // Empêche le navigateur de deviner le type MIME
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Politique de référent
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Désactive des fonctionnalités dangereuses
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          // Protection XSS
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Force HTTPS (HSTS)
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          // Content Security Policy - empêche l'injection de scripts
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // nécessaire pour Next.js
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              `img-src 'self' data: blob: https://*.supabase.co https://supabase.com`,
              `connect-src 'self' https://*.supabase.co wss://*.supabase.co`,
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; ')
          },
        ],
      },
      // Headers API
      {
        source: '/api/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ]
  },

  // Images autorisées depuis Supabase uniquement
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Désactiver les images non optimisées
    dangerouslyAllowSVG: false,
  },

  // Redirections sécurisées
  async redirects() {
    return [
      // Rediriger HTTP vers HTTPS (géré par Vercel mais bonne pratique)
      {
        source: '/admin',
        has: [{ type: 'header', key: 'x-forwarded-proto', value: 'http' }],
        destination: 'https://claude-logicial-84ll.vercel.app/admin',
        permanent: true,
      },
    ]
  },

  // Compression
  compress: true,

  // Désactiver le header X-Powered-By (ne pas révéler la technologie)
  poweredByHeader: false,
}

module.exports = nextConfig
