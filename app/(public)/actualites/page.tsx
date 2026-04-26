'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { BookOpen, Search, Tag } from 'lucide-react'
import Link from 'next/link'

const PER_PAGE = 9

export default function ActualitesPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      let q = supabase.from('articles').select('*', { count: 'exact' })
        .eq('status', 'published').order('created_at', { ascending: false })
      if (category !== 'all') q = q.eq('category', category)
      if (search) q = q.ilike('title', `%${search}%`)
      const { data, count } = await q.range((page - 1) * PER_PAGE, page * PER_PAGE - 1)
      setArticles(data || [])
      setTotal(count || 0)
      setLoading(false)
    }
    load()
  }, [category, page, search])

  const { data: cats } = { data: [] }
  const pages = Math.ceil(total / PER_PAGE)

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-white">Actualités</h1>
          <p className="text-white/80 mt-4">Les dernières nouvelles de l&apos;AEAB</p>
        </div>
      </section>

      <section className="py-10 max-w-6xl mx-auto px-4">
        {/* Recherche */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="form-input pl-10" placeholder="Rechercher un article..."
              value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
          </div>
        </div>

        {/* Articles */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-vert border-t-transparent rounded-full" /></div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(a => (
                <Link key={a.id} href={`/actualites/${a.slug || a.id}`}
                  className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:-translate-y-1 transition-transform group">
                  <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                    {a.image_url
                      ? <img src={a.image_url} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center text-gray-300"><BookOpen className="w-12 h-12" /></div>}
                  </div>
                  <div className="p-5">
                    {a.category && (
                      <span className="inline-flex items-center gap-1 text-xs bg-vert-50 text-vert px-2 py-0.5 rounded-full mb-2 font-semibold">
                        <Tag className="w-3 h-3" /> {a.category}
                      </span>
                    )}
                    <h3 className="font-heading font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-vert transition-colors">{a.title}</h3>
                    <p className="text-xs text-gray-400 mt-2">{new Date(a.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    {a.author && <p className="text-xs text-gray-400">Par {a.author}</p>}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50">← Précédent</button>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold ${page === p ? 'bg-vert text-white' : 'border hover:bg-gray-50'}`}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                  className="px-4 py-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50">Suivant →</button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Aucun article trouvé.</p>
          </div>
        )}
      </section>
    </div>
  )
}
