import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ArrowRight, Heart, Users, Calendar, BookOpen, HandHeart, Star } from 'lucide-react'

export const revalidate = 60

async function getHomeData() {
  const [eventsRes, articlesRes, teamRes, partnersRes] = await Promise.all([
    supabase.from('events').select('*').eq('status', 'upcoming').order('date', { ascending: true }).limit(3),
    supabase.from('articles').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(3),
    supabase.from('team_members').select('*').eq('is_active', true).order('order_index').limit(6),
    supabase.from('partners').select('*').limit(8),
  ])
  return {
    events:   eventsRes.data   || [],
    articles: articlesRes.data || [],
    team:     teamRes.data     || [],
    partners: partnersRes.data || [],
  }
}

export default async function HomePage() {
  const { events, articles, team, partners } = await getHomeData()

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="hero-gradient crescent-bg relative overflow-hidden">
        {/* Red top accent */}
        <div className="absolute top-0 left-0 right-0 h-[5px] bg-rouge z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 relative z-10">
          <div className="max-w-2xl">

            {/* Badge */}
            <div className="
              inline-flex items-center gap-2
              bg-white/12 backdrop-blur-sm
              border border-white/22 rounded-full
              px-5 py-2 mb-7
              animate-fade-in-up
            ">
              <Star className="w-3.5 h-3.5 text-rouge-400" />
              <span className="text-[12.5px] text-white/90 font-semibold tracking-wide">
                Bienvenue parmi nous
              </span>
            </div>

            {/* Title */}
            <h1 className="
              font-heading text-[44px] sm:text-[54px] lg:text-[60px]
              font-extrabold text-white leading-[1.12]
              mb-6
              animate-fade-in-up animate-delay-100
            ">
              Association des Étudiants{' '}
              <em className="text-rouge-300 not-italic font-normal">Algériens</em>
              {' '}à Bordeaux
            </h1>

            {/* Subtitle */}
            <p className="
              text-[16px] text-white/78 leading-[1.75]
              max-w-[500px] mb-10
              animate-fade-in-up animate-delay-200
            ">
              Solidarité, entraide et accompagnement pour chaque étudiant algérien à Bordeaux.
              Ensemble, construisons notre communauté.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 animate-fade-in-up animate-delay-300">
              <Link href="/adhesion" className="btn-white">
                Rejoindre l&apos;association
              </Link>
              <Link href="/aide" className="btn-rouge">
                <HandHeart className="w-4 h-4" /> Demander de l&apos;aide
              </Link>
              <Link href="/evenements" className="btn-ghost">
                Événements
              </Link>
            </div>

            {/* Stats */}
            <div className="
              flex gap-10 mt-14 pt-10
              border-t border-white/14
              animate-fade-in-up animate-delay-400
            ">
              {[
                ['500+', 'Étudiants aidés'],
                ['3 ans', "D'existence"],
                ['12', 'Bénévoles actifs'],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-heading text-[30px] font-extrabold text-white leading-none">{n}</div>
                  <div className="text-[12px] text-white/55 mt-1.5 font-medium">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave */}
        <svg viewBox="0 0 1440 72" className="w-full relative z-10" style={{ display: 'block' }}>
          <path fill="#ffffff" d="M0,36 C240,72 480,0 720,36 C960,72 1200,18 1440,36 L1440,72 L0,72 Z" />
        </svg>
      </section>

      {/* ═══════ QUICK ACTIONS ═══════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="section-label">Ce qu'on fait</span>
            <h2 className="font-heading text-[36px] font-bold text-gray-900">Comment on peut vous aider</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Users,     title: 'Adhésion',        desc: "Devenez membre de notre communauté et bénéficiez de tous nos services.",         href: '/adhesion', bg: 'bg-vert-50',   accent: 'text-vert'  },
              { icon: HandHeart, title: 'Aide & soutien',  desc: "Accompagnement administratif, alimentaire, hébergement d'urgence.",              href: '/aide',     bg: 'bg-rouge-50',  accent: 'text-rouge' },
              { icon: Calendar,  title: 'Événements',      desc: "Soirées, ateliers, conférences — des activités pour créer des liens.",           href: '/evenements', bg: 'bg-vert-50',  accent: 'text-vert' },
              { icon: BookOpen,  title: 'Guide étudiant',  desc: "CROUS, titre de séjour, CAF — toutes les démarches expliquées.",                href: '/guide',    bg: 'bg-rouge-50',  accent: 'text-rouge' },
            ].map((a) => (
              <Link key={a.title} href={a.href} className="card p-7 group block">
                <div className={`w-14 h-14 rounded-[16px] ${a.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <a.icon className={`w-6 h-6 ${a.accent}`} />
                </div>
                <h3 className="font-heading font-bold text-[18px] text-gray-900 mb-2.5">{a.title}</h3>
                <p className="text-[13.5px] text-gray-500 leading-relaxed mb-4">{a.desc}</p>
                <div className={`flex items-center gap-1.5 text-[13px] font-bold ${a.accent} group-hover:gap-2.5 transition-all`}>
                  En savoir plus <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ ÉVÉNEMENTS ═══════ */}
      <section className="py-20 bg-vert-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="section-label-vert">Prochainement</span>
              <h2 className="font-heading text-[34px] font-bold text-gray-900">Événements à venir</h2>
            </div>
            <Link href="/evenements" className="hidden sm:flex items-center gap-2 text-[14px] font-bold text-vert bg-white px-5 py-2.5 rounded-full border border-vert-200 hover:bg-vert-50 transition-colors">
              Tout voir <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event: any) => (
                <div key={event.id} className="card group">
                  <div className="aspect-[16/9] bg-gradient-to-br from-vert-100 to-vert-50 relative overflow-hidden border-b-2 border-vert-100">
                    {event.image_url ? (
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-vert-300">
                        <Calendar className="w-14 h-14" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-white rounded-[10px] px-3 py-1.5 shadow-md">
                      <span className="text-[12px] font-bold text-vert">
                        {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 lg:p-6">
                    <h3 className="font-heading font-bold text-[17px] text-gray-900 line-clamp-2 mb-2.5">{event.title}</h3>
                    <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed mb-3">{event.description}</p>
                    <div className="text-[12px] text-gray-400 font-medium">{event.location} · {event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-25" />
              <p className="text-[15px]">Les événements seront publiés prochainement.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════ ACTUALITÉS ═══════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="section-label">Blog</span>
              <h2 className="font-heading text-[34px] font-bold text-gray-900">Dernières actualités</h2>
            </div>
            <Link href="/actualites" className="hidden sm:flex items-center gap-2 text-[14px] font-bold text-rouge bg-rouge-50 px-5 py-2.5 rounded-full border border-rouge-200 hover:bg-rouge-100 transition-colors">
              Tout lire <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article: any) => (
                <Link key={article.id} href={`/actualites/${article.slug}`} className="card-rouge group block">
                  <div className="aspect-[16/9] bg-gradient-to-br from-rouge-100 to-rouge-50 relative overflow-hidden border-b-2 border-rouge-100">
                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-rouge-200">
                        <BookOpen className="w-14 h-14" />
                      </div>
                    )}
                    {article.category && (
                      <span className="absolute top-3 left-3 bg-rouge text-white text-[10.5px] font-bold px-3 py-1 rounded-full tracking-wide">
                        {article.category}
                      </span>
                    )}
                  </div>
                  <div className="p-5 lg:p-6">
                    <h3 className="font-heading font-bold text-[17px] text-gray-900 line-clamp-2 leading-snug mb-3 group-hover:text-rouge transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-[12px] text-gray-400 font-medium">
                      {new Date(article.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-25" />
              <p className="text-[15px]">Les articles seront publiés prochainement.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════ ÉQUIPE ═══════ */}
      {team.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="section-label-vert">Notre force</span>
              <h2 className="font-heading text-[34px] font-bold text-gray-900">L&apos;équipe</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
              {team.map((member: any, i: number) => (
                <div key={member.id} className="text-center group">
                  <div className={`
                    w-[76px] h-[76px] mx-auto rounded-full
                    ${i % 2 === 0 ? 'bg-vert-50' : 'bg-rouge-50'}
                    border-[3px] border-white
                    shadow-md group-hover:shadow-lg transition-shadow
                    flex items-center justify-center mb-3
                    overflow-hidden
                  `}>
                    {member.photo_url ? (
                      <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className={`font-heading font-extrabold text-[22px] ${i % 2 === 0 ? 'text-vert' : 'text-rouge'}`}>
                        {member.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="text-[13.5px] font-bold text-gray-900">{member.name}</div>
                  <div className="text-[11.5px] text-gray-400 mt-1 font-medium">{member.role}</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/equipe" className="btn-outline !text-sm">
                Voir toute l&apos;équipe
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════ CTA DON ═══════ */}
      <section className="py-24 bg-gradient-to-br from-rouge to-rouge-700 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute left-[5%] top-1/2 -translate-y-1/2 text-[320px] text-white/[0.05] leading-none select-none pointer-events-none">♡</div>
        <div className="absolute bottom-0 left-0 right-0 h-[5px] bg-vert" />
        <div className="max-w-[560px] mx-auto px-4 text-center relative z-10">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/55 mb-4">Soutenez-nous</div>
          <h2 className="font-heading text-[40px] lg:text-[46px] font-extrabold text-white leading-[1.15] mb-5">
            Chaque don change{' '}
            <em className="font-normal not-italic">une vie</em>
          </h2>
          <p className="text-[16px] text-white/78 leading-[1.75] mb-12">
            Aide alimentaire, hébergement d&apos;urgence, soutien administratif — votre générosité est notre force.
          </p>
          <Link href="/don" className="btn-white !text-[16px] !px-8 !py-4">
            <Heart className="w-5 h-5" /> Faire un don maintenant
          </Link>
        </div>
      </section>

      {/* ═══════ PARTENAIRES ═══════ */}
      {partners.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-center font-heading font-bold text-[18px] text-gray-300 mb-10">
              Nos partenaires
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-12">
              {partners.map((p: any) => (
                <div key={p.id} className="grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-300">
                  {p.logo_url ? (
                    <img src={p.logo_url} alt={p.name} className="h-10 object-contain" />
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
