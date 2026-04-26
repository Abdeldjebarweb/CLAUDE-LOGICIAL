import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'AEAB – Association des Étudiants Algériens de Bordeaux',
    template: '%s – AEAB Bordeaux',
  },
  description: 'Solidarité, entraide et accompagnement pour chaque étudiant algérien de Bordeaux. Adhésion, événements, aide logement et administrative.',
  keywords: ['étudiants algériens', 'Bordeaux', 'association', 'aide', 'logement', 'entraide', 'algérien'],
  authors: [{ name: 'AEAB' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://claude-logicial-84ll.vercel.app',
    siteName: 'AEAB – Association des Étudiants Algériens de Bordeaux',
    title: 'AEAB – Association des Étudiants Algériens de Bordeaux',
    description: 'Solidarité, entraide et accompagnement pour les étudiants algériens de Bordeaux.',
    images: [{
      url: 'https://i.ibb.co/LDtrRVPK/Whats-App-Image-2026-04-25-at-18-53-30.jpg',
      width: 1200,
      height: 630,
      alt: 'AEAB Logo',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AEAB – Association des Étudiants Algériens de Bordeaux',
    description: 'Solidarité, entraide et accompagnement pour les étudiants algériens de Bordeaux.',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  icons: {
    icon: 'https://i.ibb.co/LDtrRVPK/Whats-App-Image-2026-04-25-at-18-53-30.jpg',
    apple: 'https://i.ibb.co/LDtrRVPK/Whats-App-Image-2026-04-25-at-18-53-30.jpg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a5c38" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AEAB" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
