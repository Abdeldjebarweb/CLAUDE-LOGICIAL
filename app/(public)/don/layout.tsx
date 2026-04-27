import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Faire un don",
  description: "Soutenez l'AEAB et aidez les etudiants algeriens de Bordeaux.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
