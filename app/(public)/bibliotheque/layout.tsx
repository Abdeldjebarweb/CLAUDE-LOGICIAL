import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bibliothèque de documents',
  description: 'Guides et modèles pour étudiants algériens à Bordeaux.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
