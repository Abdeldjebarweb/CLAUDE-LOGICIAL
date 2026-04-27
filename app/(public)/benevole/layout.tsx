import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Devenir bénévole',
  description: 'Rejoignez l'équipe bénévole de l'AEAB Bordeaux.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
