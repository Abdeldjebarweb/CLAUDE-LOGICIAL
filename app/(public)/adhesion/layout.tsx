import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Adherer",
  description: "Rejoignez lAssociation des Etudiants Algeriens de Bordeaux.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
