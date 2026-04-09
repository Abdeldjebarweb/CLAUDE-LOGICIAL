import { Home, FileText, Users, Music, Utensils, HeartHandshake } from 'lucide-react'

export const metadata = { title: 'Notre mission – AEAB' }

const missions = [
  { icon: Home, title: 'Accueil des nouveaux', desc: 'Accueillir les étudiants dès leur arrivée à Bordeaux avec un accompagnement personnalisé.' },
  { icon: Home, title: 'Aide à l\'installation', desc: 'Recherche de logement, colocation, conseils pratiques pour bien s\'installer.' },
  { icon: FileText, title: 'Accompagnement administratif', desc: 'Titre de séjour, CAF, sécurité sociale, compte bancaire — on vous guide.' },
  { icon: Music, title: 'Actions culturelles', desc: 'Valoriser la culture algérienne à travers des événements et activités.' },
  { icon: Users, title: 'Événements communautaires', desc: 'Organiser des rencontres, sorties et moments de partage.' },
  { icon: HeartHandshake, title: 'Soutien social', desc: 'Aide alimentaire, hébergement d\'urgence, soutien moral et écoute.' },
]

export default function MissionPage() {
  return (
    <>
      <section className="hero-gradient py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white">Notre mission</h1>
          <p className="text-white/80 mt-4 text-lg">Ce qui nous anime au quotidien.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((m) => (
              <div key={m.title} className="card p-8 hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 rounded-2xl bg-vert-50 flex items-center justify-center mb-5">
                  <m.icon className="w-7 h-7 text-vert" />
                </div>
                <h3 className="font-heading font-bold text-xl text-gray-900">{m.title}</h3>
                <p className="text-gray-500 mt-2 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
