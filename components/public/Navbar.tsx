'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Accueil' },
  {
    label: 'Association',
    children: [
      { href: '/a-propos',  label: 'À propos' },
      { href: '/mission',   label: 'Notre mission' },
      { href: '/equipe',    label: 'Équipe & bénévoles' },
    ],
  },
  { href: '/evenements', label: 'Événements' },
  { href: '/actualites', label: 'Actualités' },
  { href: '/guide',      label: 'Guide étudiant' },
  { href: '/galerie',    label: 'Galerie' },
  { href: '/contact',    label: 'Contact' },
]

// Drapeau algérien SVG
function DrapeauAlgerie({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" clipPath="url(#circle-clip)" />
      <defs>
        <clipPath id="circle-clip">
          <circle cx="20" cy="20" r="20" />
        </clipPath>
      </defs>
      {/* Moitié gauche verte */}
      <rect x="0" y="0" width="20" height="40" fill="#006233" />
      {/* Moitié droite blanche */}
      <rect x="20" y="0" width="20" height="40" fill="#FFFFFF" />
      {/* Croissant rouge */}
      <circle cx="21" cy="20" r="8" fill="#D21034" />
      <circle cx="23.5" cy="20" r="6.5" fill="white" />
      {/* Étoile rouge */}
      <polygon
        points="20,12.5 21.2,16.1 25,16.1 22,18.4 23.2,22 20,19.7 16.8,22 18,18.4 15,16.1 18.8,16.1"
        fill="#D21034"
        transform="translate(0.5, 1.5) scale(0.85)"
      />
    </svg>
  )
}

export default function Navbar() {
  const [open,     setOpen]     = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header className={`
      sticky top-0 z-50 transition-all duration-300
      ${scrolled
        ? 'bg-white/97 backdrop-blur-md border-b border-[#e8f5e8] shadow-[0_2px_20px_rgba(0,98,51,0.08)]'
        : 'bg-white border-b border-gray-100 shadow-sm'}
    `}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px]">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="rounded-full overflow-hidden shadow-[0_4px_12px_rgba(0,98,51,0.3)] group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
              <DrapeauAlgerie size={42} />
            </div>
            <div className="hidden sm:block">
              <span className="font-heading font-extrabold text-vert text-[15px] leading-tight block">
                Association des Étudiants Algériens
              </span>
              <span className="text-[11px] text-gray-500 font-semibold leading-tight">
                de Bordeaux
              </span>
            </div>
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
                  <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13.5px] font-medium text-gray-600 hover:text-vert hover:bg-vert-50 transition-all duration-150">
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>
                  {dropdown === link.label && (
                    <div className="absolute top-[calc(100%+8px)] left-0 bg-white rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.13)] border border-[#e8f5e8] p-2 min-w-[200px] z-50">
                      {link.children.map((child) => (
                        <Link key={child.href} href={child.href} className="block px-4 py-2.5 rounded-xl text-[13.5px] font-medium text-gray-600 hover:bg-vert-50 hover:text-vert transition-all duration-150">
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
                  className={`px-3.5 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-150 ${pathname === link.href ? 'text-vert bg-vert-50' : 'text-gray-600 hover:text-vert hover:bg-vert-50'}`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* ── CTA buttons ── */}
          <div className="hidden lg:flex items-center gap-2.5">
            <Link href="/adhesion" className="btn-outline !text-sm !px-4 !py-2">Adhérer</Link>
            <Link href="/don" className="btn-rouge !text-sm !px-4 !py-2">❤ Faire un don</Link>
          </div>

          {/* ── Mobile toggle ── */}
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2.5 rounded-xl hover:bg-vert-50 transition-colors" aria-label="Menu">
            {open ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        {open && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <p className="px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">{link.label}</p>
                  {link.children.map((child) => (
                    <Link key={child.href} href={child.href} className="block px-6 py-2.5 text-sm text-gray-600 hover:text-vert hover:bg-vert-50 rounded-lg mx-2 transition-colors">
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link key={link.href} href={link.href!} className={`block px-4 py-2.5 text-sm font-medium rounded-lg mx-2 transition-colors ${pathname === link.href ? 'text-vert bg-vert-50' : 'text-gray-600 hover:text-vert hover:bg-vert-50'}`}>
                  {link.label}
                </Link>
              )
            )}
            <div className="flex gap-3 px-4 pt-4 mt-2 border-t border-gray-100">
              <Link href="/adhesion" className="btn-outline !text-sm flex-1 text-center !py-2.5">Adhérer</Link>
              <Link href="/don" className="btn-rouge !text-sm flex-1 text-center !py-2.5">❤ Faire un don</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
