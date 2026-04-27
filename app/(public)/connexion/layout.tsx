import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous a votre espace membre AEAB.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
