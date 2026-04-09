'use client'

import { useState } from 'react'
import { Plane, Home, FileText, CreditCard, Bus, Stethoscope, ShoppingCart, GraduationCap, ChevronDown } from 'lucide-react'

const sections = [
  { icon: Plane, title: 'Arrivée à Bordeaux', content: 'Préparez votre arrivée : aéroport, transport jusqu\'au centre-ville, premiers jours. L\'AEAB peut vous accueillir si vous nous contactez à l\'avance.' },
  { icon: Home, title: 'Logement & colocation', content: 'CROUS, résidences privées, colocation entre étudiants algériens, groupes Facebook, Le Bon Coin, PAP. Pensez à chercher tôt (mai-juin) et méfiez-vous des arnaques.' },
  { icon: FileText, title: 'Démarches administratives', content: 'Titre de séjour : rendez-vous en préfecture. CAF : faites votre demande dès que vous avez un logement. Sécurité sociale : inscription sur ameli.fr. Assurance habitation obligatoire.' },
  { icon: CreditCard, title: 'Compte bancaire', content: 'Banques traditionnelles (BNP, Société Générale) ou banques en ligne (Boursorama, N26). Documents nécessaires : passeport, visa, justificatif de domicile, attestation d\'inscription.' },
  { icon: GraduationCap, title: 'Études', content: 'Universités de Bordeaux, écoles d\'ingénieur, écoles de commerce. Inscriptions, emploi du temps, bibliothèques, tutorat, vie associative étudiante.' },
  { icon: Bus, title: 'Transport', content: 'TBM (tram et bus) : abonnement étudiant à tarif réduit. VCub (vélos en libre service). Covoiturage BlaBlaCar pour les longues distances.' },
  { icon: Stethoscope, title: 'Santé', content: 'Médecin traitant, CPAM, mutuelle étudiante, centre de santé universitaire. En urgence : appelez le 15 (SAMU) ou le 112.' },
  { icon: ShoppingCart, title: 'Vie quotidienne & alimentation', content: 'Épiceries orientales à Bordeaux, marchés, boucheries halal, restaurants. Restos U pour manger pas cher. Aide alimentaire via l\'AEAB ou les Restos du Cœur.' },
]

export default function GuidePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <>
      <section className="hero-gradient py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white">Guide étudiant</h1>
          <p className="text-white/80 mt-4 text-lg">Tout ce qu&apos;il faut savoir pour bien s&apos;installer à Bordeaux.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-3">
            {sections.map((s, i) => (
              <div key={s.title} className="card overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-vert-50 flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-vert" />
                  </div>
                  <span className="font-heading font-bold text-gray-900 flex-1">{s.title}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 pl-[4.5rem] text-gray-600 leading-relaxed animate-fade-in-up">
                    {s.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
