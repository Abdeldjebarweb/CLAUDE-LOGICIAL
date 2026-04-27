import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'Association des Etudiants Algeriens de Bordeaux.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
