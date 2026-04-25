'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, BookOpen, Calendar, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function RecherchePage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ articles: any[], events: any[] }>({ articles: [], events: [] })
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const search = async () => {
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    const q = query.toLowerCase()
    const [{ data: articles }, { data: events }] = await Promise.all([
      supabase.from('articles').select('id, title, slug, category, image_url, created_at').eq('status', 'published').ilike('title', `%${q}%`).limit(6),
      supabase.from('events').select('id, title, date, location, image_url').ilike('title', `%${q}%`).limit(6),
    ])
    setResults({ articles: articles || [], events: events || [] })
    setLoading(false)
  }

  const total = results.articles.length + results.events.length

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="hero-gradient py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-white mb-6">Rechercher</h1>
          <div className="flex gap-3">
            <input type="text" className="form-input flex-1 text-base" placeholder="Articles, événements..."
              value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()} />
            <button onClick={search} disabled={loading} className="btn-primary px-6 flex items-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </section>

      <section className="py-10 max-w-4xl mx-auto px-4">
        {searched && !loading && (
          <p className="text-sm text-gray-500 mb-6">{total} résultat(s) pour &ldquo;{query}&rdquo;</p>
        )}

        {results.articles.length > 0 && (
          <div className="mb-8">
            <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-vert" /> Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.articles.map(a => (
                <Link key={a.id} href={`/actualites/${a.slug || a.id}`} className="bg-white rounded-xl border p-4 flex gap-3 hover:shadow-md transition-shadow">
                  {a.image_url && <img src={a.image_url} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm truncate">{a.title}</h3>
                    {a.category && <span className="text-xs text-vert">{a.category}</span>}
                    <p className="text-xs text-gray-400 mt-1">{new Date(a.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {results.events.length > 0 && (
          <div>
            <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-vert" /> Événements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.events.map(e => (
                <Link key={e.id} href="/evenements" className="bg-white rounded-xl border p-4 flex gap-3 hover:shadow-md transition-shadow">
                  {e.image_url && <img src={e.image_url} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm truncate">{e.title}</h3>
                    <p className="text-xs text-gray-400">{new Date(e.date).toLocaleDateString('fr-FR')}</p>
                    {e.location && <p className="text-xs text-gray-400">{e.location}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {searched && !loading && total === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Aucun résultat pour &ldquo;{query}&rdquo;</p>
          </div>
        )}
      </section>
    </div>
  )
}
