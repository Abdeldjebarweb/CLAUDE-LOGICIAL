import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Devenir benevole",
  description: "Rejoignez l'equipe benevole de l'AEAB Bordeaux.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
