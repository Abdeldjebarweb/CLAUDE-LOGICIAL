'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'

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
  { href: '/guide', label: 'Guide étudiant' },
  { href: '/galerie', label: 'Galerie' },
  { href: '/partenaires', label: 'Partenaires' },
  { href: '/contact', label: 'Contact' },
]

function AEABLogo({ dark = false }: { dark?: boolean }) {
  return (
    <svg width="180" height="48" viewBox="0 0 240 66" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="33" cy="33" r="31" fill={dark ? 'rgba(255,255,255,0.12)' : '#006233'} />
      <circle cx="33" cy="33" r="18" fill="white" />
      <circle cx="40" cy="28" r="14.5" fill={dark ? '#004d27' : '#006233'} />
      <polygon fill="#D21034" points="29,21 30.5,26 35.5,26 31.5,29 33,34 29,31 25,34 26.5,29 22.5,26 27.5,26" />
      <text x="74" y="30" fontFamily="'Playfair Display',Georgia,serif" fontSize="24" fontWeight="800" fill={dark ? '#ffffff' : '#006233'} letterSpacing="3">AEAB</text>
      <text x="74" y="46" fontFamily="'DM Sans',Arial,sans-serif" fontSize="10" fill={dark ? 'rgba(255,255,255,0.6)' : '#6b7280'}>Étudiants Algériens à Bordeaux</text>
      <rect x="74" y="51" width="152" height="2.5" rx="1.25" fill="#D21034" />
    </svg>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* ── Logo ── */}
          <Link href="/" className="group hover:opacity-90 transition-opacity">
            <AEABLogo />
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setDropdown(link.label)}
                  onMouseLeave={() => setDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-vert rounded-lg hover:bg-vert-50 transition-all">
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {dropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px] animate-fade-in-up z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-vert-50 hover:text-vert transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-vert rounded-lg hover:bg-vert-50 transition-all"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* ── CTA buttons ── */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/adhesion" className="btn-outline text-sm !px-4 !py-2">
              Adhérer
            </Link>
            <Link href="/don" className="btn-rouge text-sm !px-4 !py-2">
              Faire un don
            </Link>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        {open && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-fade-in-up">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {link.label}
                  </p>
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpen(false)}
                      className="block px-6 py-2.5 text-sm text-gray-700 hover:text-vert hover:bg-vert-50"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-vert hover:bg-vert-50"
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="flex gap-3 px-4 pt-4 mt-2 border-t border-gray-100">
              <Link href="/adhesion" className="btn-outline text-sm flex-1 text-center !py-2.5">Adhérer</Link>
              <Link href="/don" className="btn-rouge text-sm flex-1 text-center !py-2.5">Faire un don</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
