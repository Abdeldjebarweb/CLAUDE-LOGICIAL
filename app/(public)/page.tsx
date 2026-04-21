import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ArrowRight, Heart, Users, Calendar, BookOpen, HandHeart, Star } from 'lucide-react'

export const revalidate = 60

async function getHomeData() {
  const [eventsRes, articlesRes, teamRes, partnersRes] = await Promise.all([
    supabase.from('events').select('*').eq('status', 'upcoming').order('date', { ascending: true }).limit(3),
    supabase.from('articles').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(3),
    supabase.from('team_members').select('*').eq('is_active', true).order('order_index').limit(6),
    supabase.from('partners').select('*').limit(6),
  ])
  return {
    events: eventsRes.data || [],
    articles: articlesRes.data || [],
    team: teamRes.data || [],
    partners: partnersRes.data || [],
  }
}

export default async function HomePage() {
  const { events, articles, team, partners } = await getHomeData()

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden min-h-[600px]">
        {/* Image de fond drapeaux Algérie + France */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.webp')" }}
        />
        {/* Overlay vert foncé pour lisibilité */}
        <div className="absolute inset-0 bg-vert-900/75" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 animate-fade-in-up">
              <Star className="w-4 h-4 text-rouge-400" />
              <span className="text-sm text-white/90">Bienvenue parmi nous</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight animate-fade-in-up animate-delay-100">
              Association des Étudiants{' '}
              <span className="text-rouge-400">Algériens</span>{' '}
              de Bordeaux
            </h1>
            <p className="text-lg text-white/80 mt-6 leading-relaxed max-w-xl animate-fade-in-up animate-delay-200">
              Solidarité, entraide et accompagnement pour chaque étudiant algérien à Bordeaux. 
              Ensemble, construisons notre communauté.
            </p>
            <div className="flex flex-wrap gap-4 mt-8 animate-fade-in-up animate-delay-300">
              <Link href="/adhesion" className="bg-white text-vert px-7 py-3.5 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-xl hover:shadow-2xl active:scale-[0.98]">
                Rejoindre l&apos;association
              </Link>
              <Link href="/aide" className="bg-rouge text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-rouge-700 transition-all shadow-xl shadow-rouge/30 active:scale-[0.98]">
                Demander de l&apos;aide
              </Link>
              <Link href="/evenements" className="border-2 border-white/30 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all active:scale-[0.98]">
                Événements
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 80" className="w-full h-auto">
            <path fill="#ffffff" d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* ═══════ QUICK ACTIONS ═══════ */}
      <section className="py-20 pattern-algerian">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: 'Adhésion', desc: "Rejoignez notre communauté étudiante", href: '/adhesion', color: 'bg-vert' },
              { icon: HandHeart, title: 'Aide', desc: "Besoin d'accompagnement ? On est là", href: '/aide', color: 'bg-rouge' },
              { icon: Calendar, title: 'Événements', desc: 'Découvrez nos prochaines activités', href: '/evenements', color: 'bg-vert-700' },
              { icon: Heart, title: 'Don', desc: 'Soutenez nos actions solidaires', href: '/don', color: 'bg-rouge-700' },
            ].map((item) => (
              <Link key={item.title} href={item.href} className="card p-6 group hover:-translate-y-1">
                <div className={`${item.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-vert text-sm font-semibold group-hover:gap-2 transition-all">
                  En savoir plus <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ ÉVÉNEMENTS ═══════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-sm font-semibold text-rouge uppercase tracking-wider">Prochainement</span>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900 mt-1">Événements à venir</h2>
            </div>
            <Link href="/evenements" className="hidden sm:flex items-center gap-2 text-vert font-semibold hover:gap-3 transition-all">
              Tout voir <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event: any) => (
                <div key={event.id} className="card group">
                  <div className="aspect-[16/9] bg-vert-50 relative overflow-hidden">
                    {event.image_url ? (
                      <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-vert-300">
                        <Calendar className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-white rounded-lg px-3 py-1 shadow-md">
                      <span className="text-xs font-bold text-vert">{new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-lg text-gray-900 line-clamp-1">{event.title}</h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{event.description}</p>
                    <div className="text-xs text-gray-400 mt-3">{event.location} • {event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Les événements seront publiés prochainement.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════ ACTUALITÉS ═══════ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-sm font-semibold text-rouge uppercase tracking-wider">Blog</span>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900 mt-1">Dernières actualités</h2>
            </div>
            <Link href="/actualites" className="hidden sm:flex items-center gap-2 text-vert font-semibold hover:gap-3 transition-all">
              Tout lire <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article: any) => (
                <Link key={article.id} href={`/actualites/${article.slug}`} className="card group">
                  <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
                    {article.image_url ? (
                      <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <BookOpen className="w-12 h-12" />
                      </div>
                    )}
                    {article.category && (
                      <span className="absolute top-3 left-3 bg-vert text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-vert transition-colors">{article.title}</h3>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(article.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Les articles seront publiés prochainement.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════ ÉQUIPE ═══════ */}
      {team.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-rouge uppercase tracking-wider">Notre force</span>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900 mt-1">L&apos;équipe</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {team.map((member: any) => (
                <div key={member.id} className="text-center group">
                  <div className="w-20 h-20 mx-auto rounded-full bg-vert-100 overflow-hidden mb-3 border-3 border-white shadow-md group-hover:shadow-lg transition-shadow">
                    {member.photo_url ? (
                      <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-vert-400 text-2xl font-heading font-bold">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-sm text-gray-900">{member.name}</h4>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/equipe" className="btn-outline text-sm">Voir toute l&apos;équipe</Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════ CTA DON ═══════ */}
      <section className="py-20 bg-rouge relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px] text-white">♡</div>
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white">Soutenez notre association</h2>
          <p className="text-white/80 mt-4 text-lg">
            Chaque don nous permet d&apos;aider un étudiant de plus. Aide alimentaire, hébergement d&apos;urgence, soutien administratif…
          </p>
          <Link href="/don" className="inline-flex items-center gap-2 bg-white text-rouge px-8 py-4 rounded-xl font-bold text-lg mt-8 hover:bg-white/90 transition-all shadow-xl active:scale-[0.98]">
            <Heart className="w-5 h-5" /> Faire un don
          </Link>
        </div>
      </section>

      {/* ═══════ PARTENAIRES ═══════ */}
      {partners.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-center font-heading font-bold text-xl text-gray-400 mb-8">Nos partenaires</h3>
            <div className="flex flex-wrap items-center justify-center gap-10">
              {partners.map((p: any) => (
                <div key={p.id} className="grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100">
                  {p.logo_url ? (
                    <img src={p.logo_url} alt={p.name} className="h-12 object-contain" />
                  ) : (
                    <span className="text-sm font-semibold text-gray-400">{p.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
