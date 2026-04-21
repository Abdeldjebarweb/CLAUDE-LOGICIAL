import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

function DrapeauAlgerie() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="flag-circle">
          <circle cx="20" cy="20" r="20" />
        </clipPath>
      </defs>
      <g clipPath="url(#flag-circle)">
        <rect x="0" y="0" width="20" height="40" fill="#006233" />
        <rect x="20" y="0" width="20" height="40" fill="#FFFFFF" />
        <circle cx="21" cy="20" r="8" fill="#D21034" />
        <circle cx="23.5" cy="20" r="6.5" fill="white" />
        <polygon
          points="20,12.5 21.2,16.1 25,16.1 22,18.4 23.2,22 20,19.7 16.8,22 18,18.4 15,16.1 18.8,16.1"
          fill="#D21034"
          transform="translate(0.5, 1.5) scale(0.85)"
        />
      </g>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-vert-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-full overflow-hidden flex-shrink-0">
                <DrapeauAlgerie />
              </div>
              <div>
                <span className="font-heading font-bold text-base block leading-tight">
                  Association des Étudiants
                </span>
                <span className="font-heading font-bold text-base block leading-tight">
                  Algériens de Bordeaux
                </span>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Solidarité, entraide et accompagnement pour tous les étudiants algériens à Bordeaux.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Navigation</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/a-propos', label: 'À propos' },
                { href: '/evenements', label: 'Événements' },
                { href: '/actualites', label: 'Actualités' },
                { href: '/guide', label: 'Guide étudiant' },
                { href: '/galerie', label: 'Galerie' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Agir</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/adhesion', label: "Rejoindre l'association" },
                { href: '/aide', label: "Demander de l'aide" },
                { href: '/don', label: 'Faire un don' },
                { href: '/contact', label: 'Nous contacter' },
                { href: '/partenaires', label: 'Partenaires' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-rouge-400 shrink-0" />
                <span className="text-sm text-white/70">Bordeaux, France</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-rouge-400 shrink-0" />
                <a href="mailto:associationeab@gmail.com" className="text-sm text-white/70 hover:text-white transition-colors">
                  associationeab@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-rouge-400 shrink-0" />
                <a href="tel:0670376767" className="text-sm text-white/70 hover:text-white transition-colors">
                  06 70 37 67 67
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Association des Étudiants Algériens de Bordeaux. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            <Link href="/mentions-legales" className="text-xs text-white/50 hover:text-white/80 transition-colors">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="text-xs text-white/50 hover:text-white/80 transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
