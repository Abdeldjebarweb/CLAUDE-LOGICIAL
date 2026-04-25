import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-heading font-bold text-vert mb-4">404</div>
        <div className="w-24 h-1 bg-rouge mx-auto mb-6 rounded-full" />
        <h1 className="font-heading text-2xl font-bold text-gray-900 mb-3">
          Page introuvable
        </h1>
        <p className="text-gray-500 mb-8">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            Retour à l&apos;accueil
          </Link>
          <Link href="/contact" className="btn-outline">
            Nous contacter
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 text-sm">
          {[
            { href: '/evenements', label: '📅 Événements' },
            { href: '/actualites', label: '📰 Actualités' },
            { href: '/adhesion', label: '👥 Adhésion' },
            { href: '/contact', label: '📞 Contact' },
          ].map(l => (
            <Link key={l.href} href={l.href}
              className="bg-white border rounded-xl p-3 text-gray-600 hover:text-vert hover:border-vert transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
