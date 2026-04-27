import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Bibliotheque",
  description: "Guides et modeles pour etudiants algeriens a Bordeaux.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
