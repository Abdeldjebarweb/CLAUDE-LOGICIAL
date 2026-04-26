'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Search } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Accueil' },
  {
    label: 'Association',
    children: [
      { href: '/a-propos', label: 'À propos' },
      { href: '/mission', label: 'Notre mission' },
      { href: '/equipe', label: 'Équipe & bénévoles' },
    ],
  },
  { href: '/evenements', label: 'Événements' },
  { href: '/actualites', label: 'Actualités' },
  {
    label: 'Communauté',
    children: [
      { href: '/membre', label: '👤 Espace membre' },
      { href: '/annuaire', label: '📋 Annuaire' },
      { href: '/covoiturage', label: '🚗 Covoiturage' },
      { href: '/transporteurs', label: '✈️ Transporteurs' },
      { href: '/votes', label: '🗳️ Votes & sondages' },
      { href: '/annonces', label: '💼 Emploi & stages' },
      { href: '/bibliotheque', label: '📚 Bibliothèque' },
    ],
  },
  { href: '/galerie', label: 'Galerie' },
  { href: '/guide', label: 'Guide' },
  { href: '/contact', label: 'Contact' },
]



export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo avec vrai drapeau algérien */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 overflow-hidden group-hover:scale-110 transition-transform flex-shrink-0">
              <img src="https://i.ibb.co/LDtrRVPK/Whats-App-Image-2026-04-25-at-18-53-30.jpg" alt="Logo AEAB" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <span className="font-heading font-bold text-vert text-base leading-tight block">
                Association des Étudiants
              </span>
              <span className="font-heading font-bold text-vert text-base leading-tight block">
                Algériens
              </span>
              <span className="text-[10px] text-gray-500 leading-tight">de Bordeaux</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative"
                  onMouseEnter={() => setDropdown(link.label)}
                  onMouseLeave={() => setDropdown(null)}>
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-vert rounded-lg hover:bg-vert-50 transition-all">
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {dropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px] animate-fade-in-up">
                      {link.children.map((child) => (
                        <Link key={child.href} href={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:text-vert hover:bg-vert-50 transition-colors">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link key={link.href} href={link.href!}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-vert rounded-lg hover:bg-vert-50 transition-all">
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Search */}
          <a href="/recherche" className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-vert transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
            <Search className="w-4 h-4" />
          </a>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/adhesion" className="btn-outline text-sm !px-4 !py-2">Adhérer</Link>
            <Link href="/don" className="btn-rouge text-sm !px-4 !py-2">❤️ Faire un don</Link>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-fade-in-up">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {link.label}
                  </p>
                  {link.children.map((child) => (
                    <Link key={child.href} href={child.href} onClick={() => setOpen(false)}
                      className="block px-6 py-2.5 text-sm text-gray-700 hover:text-vert hover:bg-vert-50">
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link key={link.href} href={link.href!} onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-vert hover:bg-vert-50">
                  {link.label}
                </Link>
              )
            )}
            <div className="flex gap-3 px-4 pt-4 mt-2 border-t border-gray-100">
              <Link href="/adhesion" className="btn-outline text-sm flex-1 text-center !py-2.5">Adhérer</Link>
              <Link href="/don" className="btn-rouge text-sm flex-1 text-center !py-2.5">❤️ Faire un don</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
