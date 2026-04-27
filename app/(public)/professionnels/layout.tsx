import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Espace professionnels",
  description: "Offres emploi pour etudiants algeriens de Bordeaux.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
