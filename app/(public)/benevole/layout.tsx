import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Devenir benevole",
  description: "Rejoignez lequipe benevole de lAEAB Bordeaux.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
