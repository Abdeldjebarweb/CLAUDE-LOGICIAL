'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ArrowRight, Heart, Users, Calendar, BookOpen, HandHeart, Star, MapPin, Clock, Quote } from 'lucide-react'

const testimonials = [
  { nom: "Yasmine B.", texte: "L'AEAB m'a aidée à trouver un logement dès mon arrivée de Bordeaux. Sans eux, j'aurais été perdue.", role: "Étudiante en médecine" },
  { nom: "Karim M.", texte: "Grâce à l'association, j'ai rencontré des amis formidables et je me suis vraiment intégré de Bordeaux.", role: "Étudiant en informatique" },
  { nom: "Isma A.", texte: "Les événements organisés par l'AEAB sont toujours super ! C'est une vraie famille loin de chez nous.", role: "Étudiante en droit" },
]

const stats = [
  { label: "Membres actifs", value: 200, suffix: "+" },
  { label: "Événements par an", value: 24, suffix: "" },
  { label: "Demandes traitées", value: 150, suffix: "+" },
  { label: "Années d'existence", value: 10, suffix: "+" },
]

function CountUp({ target, suffix }: { target: number, suffix: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / 40
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 40)
    return () => clearInterval(timer)
  }, [target])
  return <span>{count}{suffix}</span>
}

export default function HomePage() {
  const [events, setEvents] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [team, setTeam] = useState<any[]>([])
  const [testimonialIdx, setTestimonialIdx] = useState(0)

  useEffect(() => {
    supabase.from('events').select('*').eq('status', 'upcoming').order('date', { ascending: true }).limit(3).then(({ data }) => setEvents(data || []))
    supabase.from('articles').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(3).then(({ data }) => setArticles(data || []))
    supabase.from('partners').select('*').limit(8).then(({ data }) => setPartners(data || []))
    supabase.from('team_members').select('*').eq('is_active', true).order('order_index').limit(6).then(({ data }) => setTeam(data || []))

    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % testimonials.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white/90 font-medium">Bienvenue parmi nous</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Association des Étudiants{' '}
              <span className="text-rouge-400">Algériens</span>{' '}
              de Bordeaux
            </h1>
            <p className="text-lg text-white/80 mt-6 leading-relaxed max-w-xl">
              Solidarité, entraide et accompagnement pour chaque étudiant algérien de Bordeaux.
              Ensemble, construisons notre communauté.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/adhesion" className="bg-white text-vert px-7 py-3.5 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-xl">
                Rejoindre l&apos;association
              </Link>
              <Link href="/contact" className="bg-rouge text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-rouge-700 transition-all shadow-xl">
                Demander de l&apos;aide
              </Link>
              <Link href="/evenements" className="border-2 border-white/30 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all">
                Événements
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full h-auto">
            <path fill="#ffffff" d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-vert-50 transition-colors">
                <div className="font-heading text-4xl font-bold text-vert mb-1">
                  <CountUp target={s.value} suffix={s.suffix} />
                </div>
                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ QUICK ACTIONS ═══════ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-gray-900">Comment pouvons-nous vous aider ?</h2>
            <p className="text-gray-500 mt-2">Des services pensés pour les étudiants algériens de Bordeaux</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: 'Adhésion', desc: 'Rejoignez notre communauté et accédez à tous nos services', href: '/adhesion', color: 'bg-vert', light: 'bg-vert-50 text-vert' },
              { icon: HandHeart, title: 'Demande d\'aide', desc: 'Logement, admin, santé… on vous accompagne', href: '/contact', color: 'bg-rouge', light: 'bg-rouge-50 text-rouge' },
              { icon: Calendar, title: 'Événements', desc: 'Soirées, ateliers, sorties et rencontres culturelles', href: '/evenements', color: 'bg-vert-700', light: 'bg-vert-50 text-vert-700' },
              { icon: Heart, title: 'Faire un don', desc: 'Soutenez nos actions solidaires envers les étudiants', href: '/don', color: 'bg-rouge-700', light: 'bg-rouge-50 text-rouge-700' },
            ].map((item) => (
              <Link key={item.title} href={item.href} className="bg-white p-6 rounded-2xl border hover:shadow-lg hover:-translate-y-1 transition-all group">
                <div className={`${item.light} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-vert text-sm font-semibold group-hover:gap-2 transition-all">
                  En savoir plus <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ ÉVÉNEMENTS ═══════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-sm font-semibold text-rouge uppercase tracking-wider">Prochainement</span>
              <h2 className="font-heading text-3xl font-bold text-gray-900 mt-1">Événements à venir</h2>
            </div>
            <Link href="/evenements" className="hidden sm:flex items-center gap-2 text-vert font-semibold hover:gap-3 transition-all">
              Tout voir <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event: any) => (
                <Link key={event.id} href="/evenements" className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:-translate-y-1 transition-transform group">
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
                    {event.is_free && <div className="absolute top-3 right-3 bg-vert text-white text-xs font-bold px-2 py-1 rounded-lg">Gratuit</div>}
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-lg text-gray-900 line-clamp-1">{event.title}</h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{event.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-3">
                      {event.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>}
                      {event.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.time}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl text-gray-400">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Les événements seront publiés prochainement.</p>
              <Link href="/evenements" className="btn-primary mt-4 inline-block text-sm">Voir tous les événements</Link>
            </div>
          )}
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="py-16 bg-vert text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold mb-10">Ce que disent nos membres</h2>
          <div className="relative min-h-[180px]">
            {testimonials.map((t, i) => (
              <div key={i} className={`transition-all duration-500 absolute inset-0 ${i === testimonialIdx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <Quote className="w-10 h-10 text-white/30 mx-auto mb-4" />
                <p className="text-xl text-white/90 italic leading-relaxed mb-6">&ldquo;{t.texte}&rdquo;</p>
                <div>
                  <p className="font-bold text-white">{t.nom}</p>
                  <p className="text-white/60 text-sm">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setTestimonialIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === testimonialIdx ? 'bg-white w-6' : 'bg-white/40'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ ACTUALITÉS ═══════ */}
      {articles.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-sm font-semibold text-rouge uppercase tracking-wider">Blog</span>
                <h2 className="font-heading text-3xl font-bold text-gray-900 mt-1">Dernières actualités</h2>
              </div>
              <Link href="/actualites" className="hidden sm:flex items-center gap-2 text-vert font-semibold hover:gap-3 transition-all">
                Tout lire <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article: any) => (
                <Link key={article.id} href={`/actualites/${article.slug || article.id}`} className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:-translate-y-1 transition-transform group">
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
                    <p className="text-xs text-gray-400 mt-2">{new Date(article.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ ÉQUIPE ═══════ */}
      {team.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-rouge uppercase tracking-wider">Notre force</span>
              <h2 className="font-heading text-3xl font-bold text-gray-900 mt-1">L&apos;équipe</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {team.map((member: any) => (
                <div key={member.id} className="text-center group">
                  <div className="w-20 h-20 mx-auto rounded-full bg-vert-100 overflow-hidden mb-3 shadow-md group-hover:shadow-lg transition-shadow">
                    {member.photo_url ? (
                      <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-vert text-2xl font-bold">
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
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white">Soutenez notre association</h2>
          <p className="text-white/80 mt-4 text-lg">
            Chaque don nous permet d&apos;aider un étudiant de plus.
          </p>
          <a href="https://www.helloasso.com/associations/association-des-etudiants-algeriens-de-bordeaux" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-rouge px-8 py-4 rounded-xl font-bold text-lg mt-8 hover:bg-white/90 transition-all shadow-xl">
            <Heart className="w-5 h-5" /> Faire un don
          </a>
        </div>
      </section>

      {/* ═══════ PARTENAIRES ═══════ */}
      {partners.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-center font-heading font-bold text-lg text-gray-400 mb-8">Nos partenaires</h3>
            <div className="flex flex-wrap items-center justify-center gap-10">
              {partners.map((p: any) => (
                <div key={p.id} className="grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100">
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
