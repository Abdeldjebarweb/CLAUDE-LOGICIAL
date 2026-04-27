import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recherche',
  description: 'Recherchez sur le site de l'AEAB Bordeaux.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
