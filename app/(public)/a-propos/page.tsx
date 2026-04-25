import { supabase } from '@/lib/supabase'
import { Heart, Users, Star, Globe, Shield, HandHeart } from 'lucide-react'

export const revalidate = 60
export const metadata = { title: 'À propos – AEAB' }

const valeurs = [
  { icon: Heart, title: 'Solidarité', desc: 'Nous croyons en l\'entraide entre étudiants algériens. Personne ne devrait traverser seul les difficultés de la vie à l\'étranger.' },
  { icon: Users, title: 'Communauté', desc: 'Créer un espace de rencontre, d\'échange et de partage pour tous les étudiants algériens de Bordeaux.' },
  { icon: Shield, title: 'Confiance', desc: 'Un environnement sûr et bienveillant où chaque membre peut s\'exprimer et demander de l\'aide librement.' },
  { icon: Globe, title: 'Intégration', desc: 'Aider nos membres à s\'intégrer dans la vie bordelaise tout en préservant leur identité culturelle algérienne.' },
  { icon: Star, title: 'Excellence', desc: 'Soutenir la réussite académique et professionnelle de chaque étudiant membre de notre association.' },
  { icon: HandHeart, title: 'Bienveillance', desc: 'Accueillir chaque nouvel arrivant avec chaleur et lui offrir le soutien dont il a besoin.' },
]

export default async function AProposPage() {
  const { data: team } = await supabase.from('team_members').select('*').eq('is_active', true).order('order_index').limit(4)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-4">À propos de l&apos;AEAB</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            L&apos;Association des Étudiants Algériens de Bordeaux, un espace de solidarité et d&apos;entraide depuis plus de 5 ans.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-auto">
            <path fill="#ffffff" d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,35 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Histoire */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold text-rouge uppercase tracking-wider">Notre histoire</span>
              <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2 mb-4">Nés d&apos;un besoin, portés par une vision</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>L&apos;AEAB est née de la volonté d&apos;un groupe d&apos;étudiants algériens de Bordeaux de créer un espace d&apos;entraide et de solidarité pour leurs compatriotes arrivant dans cette ville.</p>
                <p>Depuis sa création, l&apos;association n&apos;a cessé de grandir, accueillant chaque année de nouveaux membres et développant des services toujours plus adaptés aux besoins des étudiants.</p>
                <p>Aujourd&apos;hui, l&apos;AEAB compte plus de 200 membres actifs et organise plus de 24 événements par an, allant des soirées culturelles aux ateliers pratiques en passant par les sorties touristiques.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '200+', label: 'Membres actifs' },
                { value: '5+', label: 'Années d\'existence' },
                { value: '24+', label: 'Événements/an' },
                { value: '150+', label: 'Demandes traitées' },
              ].map((s, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-6 text-center">
                  <div className="font-heading text-4xl font-bold text-vert">{s.value}</div>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-rouge uppercase tracking-wider">Ce qui nous guide</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">Nos valeurs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {valeurs.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border hover:shadow-md transition-shadow">
                <div className="bg-vert-50 text-vert w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe */}
      {team && team.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-10">Le bureau</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {team.map(m => (
                <div key={m.id} className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-vert-100 overflow-hidden mb-3 shadow-md">
                    {m.photo_url
                      ? <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-vert text-2xl font-bold">{m.name.charAt(0)}</div>}
                  </div>
                  <h4 className="font-semibold text-sm">{m.name}</h4>
                  <p className="text-xs text-vert">{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-vert text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold mb-4">Rejoignez l&apos;AEAB</h2>
          <p className="text-white/80 mb-8">Faites partie de notre communauté et bénéficiez de tous nos services.</p>
          <a href="/adhesion" className="inline-block bg-white text-vert px-8 py-3.5 rounded-xl font-bold hover:bg-white/90 transition-all shadow-lg">
            Adhérer maintenant
          </a>
        </div>
      </section>
    </div>
  )
}
