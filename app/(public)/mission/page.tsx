import { Heart, Users, Shield, BookOpen, Home, Stethoscope, FileText, HandHeart } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Notre mission – AEAB' }

const missions = [
  { icon: Home, title: 'Aide au logement', desc: 'Accompagnement dans la recherche de logement, conseils sur les droits des locataires et aide aux démarches CAF.', color: 'bg-blue-50 text-blue-600' },
  { icon: FileText, title: 'Démarches administratives', desc: 'Aide pour les titres de séjour, inscription université, ouverture de compte bancaire et démarches préfecture.', color: 'bg-purple-50 text-purple-600' },
  { icon: Stethoscope, title: 'Santé & bien-être', desc: 'Orientation vers les structures de santé, aide pour la sécurité sociale étudiante et mutuelle santé.', color: 'bg-rouge-50 text-rouge' },
  { icon: BookOpen, title: 'Soutien académique', desc: 'Mise en relation avec des tuteurs, conseils orientation et accompagnement dans la vie universitaire.', color: 'bg-vert-50 text-vert' },
  { icon: Users, title: 'Intégration sociale', desc: 'Événements culturels, sorties, rencontres pour créer des liens et s\'intégrer dans la vie bordelaise.', color: 'bg-yellow-50 text-yellow-600' },
  { icon: HandHeart, title: 'Aide d\'urgence', desc: 'Soutien alimentaire d\'urgence, aide financière ponctuelle et réseau de solidarité entre membres.', color: 'bg-orange-50 text-orange-600' },
]

const etapes = [
  { num: '01', title: 'Vous arrivez à Bordeaux', desc: 'Nouvel arrivant ou déjà sur place, l\'AEAB vous accueille.' },
  { num: '02', title: 'Vous adhérez', desc: 'Rejoignez la communauté et accédez à tous nos services gratuitement.' },
  { num: '03', title: 'Vous êtes accompagné', desc: 'Notre équipe vous aide dans toutes vos démarches.' },
  { num: '04', title: 'Vous contribuez', desc: 'À votre tour, vous aidez les nouveaux arrivants.' },
]

export default function MissionPage() {
  return (
    <div className="min-h-screen">
      <section className="hero-gradient py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-4">Notre mission</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Depuis plus de 5 ans, l&apos;AEAB œuvre pour que chaque étudiant algérien à Bordeaux trouve le soutien dont il a besoin.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-auto">
            <path fill="#ffffff" d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,35 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Mission principale */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-sm font-semibold text-rouge uppercase tracking-wider">Notre raison d&apos;être</span>
          <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2 mb-6">Personne ne devrait être seul</h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
            L&apos;AEAB est née d&apos;un constat simple : arriver en France pour étudier peut être une expérience difficile et isolante. 
            Notre mission est de créer un réseau de solidarité où chaque étudiant algérien à Bordeaux peut trouver aide, 
            conseils et amitié.
          </p>
        </div>
      </section>

      {/* Ce qu'on fait */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-rouge uppercase tracking-wider">Nos actions</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">Ce que nous faisons</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((m, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border hover:shadow-lg transition-shadow">
                <div className={`${m.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <m.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{m.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-gray-900">Comment ça fonctionne ?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {etapes.map((e, i) => (
              <div key={i} className="text-center relative">
                {i < etapes.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-vert-100" />
                )}
                <div className="w-16 h-16 bg-vert text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 relative z-10">
                  {e.num}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{e.title}</h3>
                <p className="text-sm text-gray-500">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-vert text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <Heart className="w-12 h-12 mx-auto mb-4 text-white/60" />
          <h2 className="font-heading text-3xl font-bold mb-4">Besoin d&apos;aide ?</h2>
          <p className="text-white/80 mb-8">N&apos;attendez pas — contactez-nous dès maintenant.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="bg-white text-vert px-7 py-3.5 rounded-xl font-bold hover:bg-white/90 transition-all">
              Demander de l&apos;aide
            </Link>
            <Link href="/adhesion" className="border-2 border-white text-white px-7 py-3.5 rounded-xl font-bold hover:bg-white/10 transition-all">
              Adhérer
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
