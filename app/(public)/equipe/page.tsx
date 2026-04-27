import { supabase } from '@/lib/supabase'
import { Mail, Heart } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 60
export const metadata = { title: 'Équipe & bénévoles – AEAB' }

export default async function EquipePage() {
  const { data: team } = await supabase.from('team_members').select('*').eq('is_active', true).order('order_index')

  const bureau = team?.filter(m => ['Président', 'Vice-Président', 'Trésorier', 'Secrétaire', 'Présidente', 'Vice-Présidente', 'Trésorière', 'Secrétaire Général'].some(r => m.role?.includes(r))) || []
  const autres = team?.filter(m => !bureau.find(b => b.id === m.id)) || []

  return (
    <div className="min-h-screen">
      <section className="hero-gradient py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-4">Notre équipe</h1>
          <p className="text-white/80 text-lg">Les personnes qui font vivre l&apos;AEAB au quotidien</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-auto">
            <path fill="#ffffff" d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,35 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Bureau */}
      {bureau.length > 0 && <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-rouge uppercase tracking-wider">Direction</span>
            <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">Le bureau</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bureau.slice(0, 4).map((m: any) => (
              <div key={m.id} className="text-center group">
                <div className="w-32 h-32 mx-auto rounded-2xl bg-vert-100 overflow-hidden mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                  {m.photo_url
                    ? <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-vert text-4xl font-bold font-heading">{m.name?.charAt(0)}</div>}
                </div>
                <h3 className="font-heading font-bold text-lg text-gray-900">{m.name}</h3>
                <p className="text-vert font-semibold text-sm mt-1">{m.role}</p>
                {m.description && <p className="text-gray-500 text-xs mt-2 leading-relaxed px-2">{m.description}</p>}
                {m.email && (
                  <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-vert mt-2 transition-colors">
                    <Mail className="w-3 h-3" /> {m.email}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>}

      {/* Autres membres */}
      {autres.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-rouge uppercase tracking-wider">L&apos;équipe</span>
              <h2 className="font-heading text-3xl font-bold text-gray-900 mt-2">Membres actifs</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {autres.map((m: any) => (
                <div key={m.id} className="text-center group">
                  <div className="w-20 h-20 mx-auto rounded-full bg-vert-100 overflow-hidden mb-3 shadow-md group-hover:shadow-lg transition-shadow">
                    {m.photo_url
                      ? <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-vert text-xl font-bold">{m.name?.charAt(0)}</div>}
                  </div>
                  <h4 className="font-semibold text-sm text-gray-900">{m.name}</h4>
                  <p className="text-xs text-gray-500">{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA rejoindre */}
      <section className="py-16 bg-vert text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <Heart className="w-12 h-12 mx-auto mb-4 text-white/60" />
          <h2 className="font-heading text-3xl font-bold mb-4">Rejoignez l&apos;équipe !</h2>
          <p className="text-white/80 mb-8">Vous souhaitez contribuer à l&apos;association ? Devenez bénévole et participez à nos actions.</p>
          <Link href="/contact" className="bg-white text-vert px-8 py-3.5 rounded-xl font-bold hover:bg-white/90 transition-all shadow-lg inline-block">
            Devenir bénévole
          </Link>
        </div>
      </section>
    </div>
  )
}
