import { Heart, Users, BookOpen, Globe } from 'lucide-react'

export const metadata = { title: 'À propos – AEAB' }

export default function AProposPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-gradient py-20 lg:py-28 relative">
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white">À propos de l&apos;AEAB</h1>
          <p className="text-white/80 mt-4 text-lg max-w-2xl mx-auto">
            Découvrez qui nous sommes, notre histoire et nos valeurs.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-6">Notre histoire</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              L&apos;Association des Étudiants Algériens à Bordeaux (AEAB) est née de la volonté de créer un espace d&apos;entraide 
              et de solidarité pour les étudiants algériens arrivant à Bordeaux. Face aux défis de l&apos;installation dans une 
              nouvelle ville — logement, démarches administratives, intégration — nous avons décidé de nous organiser pour 
              accompagner chaque étudiant dans ses premiers pas.
            </p>

            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-6">Nos valeurs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {[
                { icon: Heart, title: 'Solidarité', desc: 'Personne ne doit affronter les difficultés seul.' },
                { icon: Users, title: 'Communauté', desc: 'Créer des liens durables entre étudiants algériens.' },
                { icon: BookOpen, title: 'Accompagnement', desc: 'Guider chaque étudiant dans ses démarches.' },
                { icon: Globe, title: 'Ouverture', desc: 'Promouvoir la culture algérienne et le vivre-ensemble.' },
              ].map((v) => (
                <div key={v.title} className="card p-6">
                  <v.icon className="w-8 h-8 text-vert mb-3" />
                  <h3 className="font-heading font-bold text-lg">{v.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{v.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-6">Mot du président</h2>
            <div className="bg-vert-50 rounded-2xl p-8 border-l-4 border-vert">
              <p className="text-gray-700 italic leading-relaxed">
                « Chers étudiants, l&apos;AEAB est votre maison à Bordeaux. Que vous arriviez pour la première fois 
                ou que vous soyez déjà installés, nous sommes là pour vous accompagner, vous soutenir et partager 
                des moments forts ensemble. Bienvenue parmi nous. »
              </p>
              <p className="mt-4 font-semibold text-vert">— Le Président de l&apos;AEAB</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
