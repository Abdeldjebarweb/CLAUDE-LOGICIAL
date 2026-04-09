import { supabase } from '@/lib/supabase'

export const revalidate = 60
export const metadata = { title: 'Équipe & bénévoles – AEAB' }

export default async function EquipePage() {
  const { data: members } = await supabase.from('team_members').select('*').eq('is_active', true).order('order_index')

  return (
    <>
      <section className="hero-gradient py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white">Notre équipe</h1>
          <p className="text-white/80 mt-4 text-lg">Les bénévoles qui font vivre l&apos;association au quotidien.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {members && members.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((m: any) => (
                <div key={m.id} className="card p-6 text-center hover:-translate-y-1 transition-transform">
                  <div className="w-24 h-24 mx-auto rounded-full bg-vert-100 overflow-hidden border-4 border-white shadow-lg">
                    {m.photo_url ? (
                      <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-vert text-3xl font-heading font-bold">{m.name.charAt(0)}</div>
                    )}
                  </div>
                  <h3 className="font-heading font-bold text-lg mt-4">{m.name}</h3>
                  <p className="text-sm font-semibold text-vert">{m.role}</p>
                  {m.description && <p className="text-sm text-gray-500 mt-2">{m.description}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-16 text-gray-400">L&apos;équipe sera présentée prochainement.</p>
          )}
        </div>
      </section>
    </>
  )
}
