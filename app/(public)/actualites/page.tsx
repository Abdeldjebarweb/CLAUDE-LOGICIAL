import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { BookOpen } from 'lucide-react'

export const revalidate = 60
export const metadata = { title: 'Actualités – AEAB' }

export default async function ActualitesPage() {
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <>
      <section className="hero-gradient py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white">Actualités</h1>
          <p className="text-white/80 mt-4 text-lg">Articles, annonces et nouvelles de l&apos;association.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a: any) => (
                <Link key={a.id} href={`/actualites/${a.slug}`} className="card group">
                  <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                    {a.image_url ? (
                      <img src={a.image_url} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300"><BookOpen className="w-12 h-12" /></div>
                    )}
                  </div>
                  <div className="p-5">
                    {a.category && <span className="text-xs font-semibold text-vert bg-vert-50 px-2 py-0.5 rounded-full">{a.category}</span>}
                    <h3 className="font-heading font-bold text-lg mt-2 group-hover:text-vert transition-colors">{a.title}</h3>
                    <p className="text-xs text-gray-400 mt-2">
                      {a.author && `${a.author} · `}
                      {new Date(a.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center py-16 text-gray-400">Aucun article publié pour le moment.</p>
          )}
        </div>
      </section>
    </>
  )
}
