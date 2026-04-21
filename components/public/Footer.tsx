import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

const navCol = [
  { href: '/a-propos',   label: 'À propos' },
  { href: '/evenements', label: 'Événements' },
  { href: '/actualites', label: 'Actualités' },
  { href: '/guide',      label: 'Guide étudiant' },
  { href: '/galerie',    label: 'Galerie' },
]

const actionCol = [
  { href: '/adhesion', label: "Rejoindre l'association" },
  { href: '/aide',     label: "Demander de l'aide" },
  { href: '/don',      label: 'Faire un don' },
  { href: '/contact',  label: 'Nous contacter' },
  { href: '/partenaires', label: 'Partenaires' },
]

export default function Footer() {
  return (
    <footer className="bg-vert-800 text-white">

      {/* ── Top accent ── */}
      <div className="h-[5px] bg-rouge" />

      {/* ── Main grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">
                ☪
              </div>
              <div>
                <span className="font-heading font-extrabold text-[18px] block leading-tight">AEAB</span>
                <span className="text-[10px] text-white/50 font-medium">Étudiants Algériens à Bordeaux</span>
              </div>
            </div>
            <p className="text-[13.5px] text-white/65 leading-relaxed mb-6">
              Solidarité, entraide et accompagnement pour tous les étudiants algériens à Bordeaux.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook,  href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Twitter,   href: '#' },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/22 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading font-bold text-[17px] mb-5">Navigation</h4>
            <ul className="space-y-2.5">
              {navCol.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13.5px] text-white/60 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div>
            <h4 className="font-heading font-bold text-[17px] mb-5">Agir</h4>
            <ul className="space-y-2.5">
              {actionCol.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13.5px] text-white/60 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-[17px] mb-5">Contact</h4>
            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-rouge-400 shrink-0" />
                <span className="text-[13.5px] text-white/65">Bordeaux, France</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-rouge-400 shrink-0" />
                <a href="mailto:contact@aeab.fr" className="text-[13.5px] text-white/65 hover:text-white transition-colors">
                  contact@aeab.fr
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-rouge-400 shrink-0" />
                <span className="text-[13.5px] text-white/65">+33 X XX XX XX XX</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Association des Étudiants Algériens à Bordeaux. Tous droits réservés.
          </p>
          <div className="flex gap-5">
            <Link href="/mentions-legales" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>

    </footer>
  )
}
