import { supabase } from '@/lib/supabase'
import { ExternalLink } from 'lucide-react'

export const revalidate = 60
export const metadata = { title: 'Partenaires – AEAB' }

export default async function PartenairesPage() {
  const { data: partners } = await supabase.from('partners').select('*').order('name')

  return (
    <>
      <section className="hero-gradient py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white">Nos partenaires</h1>
          <p className="text-white/80 mt-4 text-lg">Ils soutiennent notre mission et nos actions.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {partners && partners.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((p: any) => (
                <div key={p.id} className="card p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                  {p.logo_url ? (
                    <img src={p.logo_url} alt={p.name} className="h-16 object-contain mb-4" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-vert-50 flex items-center justify-center text-vert font-heading font-bold text-xl mb-4">{p.name.charAt(0)}</div>
                  )}
                  <h3 className="font-heading font-bold text-lg">{p.name}</h3>
                  {p.category && <span className="text-xs text-vert bg-vert-50 px-2 py-0.5 rounded-full mt-1">{p.category}</span>}
                  {p.description && <p className="text-sm text-gray-500 mt-2">{p.description}</p>}
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noopener" className="flex items-center gap-1 text-sm text-vert font-semibold mt-3 hover:underline">
                      Visiter <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-16 text-gray-400">Nos partenaires seront affichés prochainement.</p>
          )}
        </div>
      </section>
    </>
  )
}
