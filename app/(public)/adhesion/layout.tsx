import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Adhérer à l'AEAB',
  description: 'Rejoignez l'Association des Étudiants Algériens de Bordeaux.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
