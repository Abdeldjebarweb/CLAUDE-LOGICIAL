'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Camera, X } from 'lucide-react'

export default function GaleriePage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [lightbox, setLightbox] = useState<any>(null)

  useEffect(() => {
    supabase.from('gallery_items').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setItems(data || []); setLoading(false) })
  }, [])

  const categories = ['all', ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))]
  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter)

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-white">Galerie</h1>
          <p className="text-white/80 mt-4">Les moments forts de notre communauté</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filtres catégories */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)}
                  className={`text-sm px-4 py-2 rounded-full font-semibold transition-all ${filter === cat ? 'bg-vert text-white' : 'bg-white border text-gray-600 hover:border-vert'}`}>
                  {cat === 'all' ? '📷 Tous' : cat}
                </button>
              ))}
            </div>
          )}

          {/* Lightbox */}
          {lightbox && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
              <button className="absolute top-4 right-4 text-white" onClick={() => setLightbox(null)}>
                <X className="w-8 h-8" />
              </button>
              <img src={lightbox.image_url} alt={lightbox.title || ''} className="max-w-full max-h-full object-contain rounded-lg" onClick={e => e.stopPropagation()} />
              {lightbox.title && (
                <div className="absolute bottom-6 left-0 right-0 text-center">
                  <p className="text-white font-semibold bg-black/50 inline-block px-4 py-2 rounded-lg">{lightbox.title}</p>
                </div>
              )}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-vert border-t-transparent rounded-full" />
            </div>
          ) : filtered.length > 0 ? (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
              {filtered.map(item => (
                <div key={item.id} onClick={() => setLightbox(item)}
                  className="break-inside-avoid cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                  <div className="relative overflow-hidden">
                    <img src={item.image_url} alt={item.title || ''}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    {item.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs font-medium">{item.title}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <Camera className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Aucune photo pour le moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
