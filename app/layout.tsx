import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Association des Étudiants Algériens à Bordeaux',
  description: 'Accueil, entraide et solidarité pour les étudiants algériens à Bordeaux. Adhésion, aide, événements et plus.',
  keywords: 'étudiants algériens, Bordeaux, association, entraide, Algérie',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}
