import { Heart, Utensils, Home, GraduationCap, Calendar, HandHeart } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Faire un don – AEAB' }

const usages = [
  { icon: Utensils, label: 'Aide alimentaire' },
  { icon: Home, label: 'Hébergement d\'urgence' },
  { icon: GraduationCap, label: 'Soutien étudiant' },
  { icon: Calendar, label: 'Événements' },
  { icon: HandHeart, label: 'Actions solidaires' },
]

export default function DonPage() {
  return (
    <>
      <section className="bg-rouge py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[400px] text-white">♡</div>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white">Faire un don</h1>
          <p className="text-white/80 mt-4 text-lg max-w-2xl mx-auto">
            Votre générosité nous permet d&apos;aider concrètement les étudiants algériens en difficulté à Bordeaux.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Usage des dons */}
          <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6 text-center">À quoi servent vos dons ?</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {usages.map(u => (
              <div key={u.label} className="flex items-center gap-2 bg-rouge-50 text-rouge-700 px-4 py-2 rounded-full text-sm font-medium">
                <u.icon className="w-4 h-4" /> {u.label}
              </div>
            ))}
          </div>

          {/* Montants suggérés */}
          <div className="card p-8 text-center">
            <Heart className="w-12 h-12 text-rouge mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">Choisissez un montant</h3>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {[5, 10, 20, 50, 100].map(amount => (
                <button key={amount} className="px-6 py-3 rounded-xl border-2 border-rouge text-rouge font-bold hover:bg-rouge hover:text-white transition-all">
                  {amount} €
                </button>
              ))}
              <button className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-600 font-bold hover:border-rouge hover:text-rouge transition-all">
                Autre
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-6">
              Vous serez redirigé vers notre plateforme de paiement sécurisée (HelloAsso / Stripe / PayPal).
            </p>
            <a href="#" className="btn-rouge inline-flex items-center gap-2 mt-6 text-lg !px-10 !py-4">
              <Heart className="w-5 h-5" /> Faire un don maintenant
            </a>
            <p className="text-xs text-gray-400 mt-4">Paiement 100% sécurisé. Aucune donnée bancaire n&apos;est stockée sur notre site.</p>
          </div>

          {/* Virement */}
          <div className="mt-8 card p-6 bg-vert-50 border-vert-200">
            <h4 className="font-heading font-bold text-lg text-vert-800">Don par virement bancaire</h4>
            <p className="text-sm text-vert-700 mt-2">
              Vous pouvez aussi nous soutenir par virement. Contactez-nous à{' '}
              <a href="mailto:tresorerie@aeab.fr" className="underline font-semibold">tresorerie@aeab.fr</a> pour obtenir nos coordonnées bancaires.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
