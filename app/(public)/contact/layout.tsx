import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez lAssociation des Etudiants Algeriens de Bordeaux.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
