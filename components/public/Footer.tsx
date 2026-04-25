import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-vert-800 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">
                ☪
              </div>
              <div>
                <span className="font-heading font-bold text-lg block">AEAB</span>
                <span className="text-xs text-white/60">Étudiants Algériens à Bordeaux</span>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Solidarité, entraide et accompagnement pour tous les étudiants algériens à Bordeaux.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="https://www.facebook.com/share/g/1bHW7gzQgQ/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
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

          {/* Links */}
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
                { href: '/adhesion', label: 'Rejoindre l\'association' },
                { href: '/aide', label: 'Demander de l\'aide' },
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
                <span className="text-sm text-white/70">06 70 37 67 67</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Association des Étudiants Algériens à Bordeaux. Tous droits réservés.
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
