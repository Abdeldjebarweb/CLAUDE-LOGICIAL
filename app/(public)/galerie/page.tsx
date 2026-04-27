'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Camera, X, ChevronLeft, ChevronRight, FolderOpen } from 'lucide-react'

export default function GaleriePage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterYear, setFilterYear] = useState('all')
  const [filterAlbum, setFilterAlbum] = useState('all')
  const [lightbox, setLightbox] = useState<{ item: any, index: number } | null>(null)

  useEffect(() => {
    supabase.from('gallery_items').select('*')
      .order('event_date', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => { setItems(data || []); setLoading(false) })
  }, [])

  // Filtres disponibles
  const categories = ['all', ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))]
  const years = ['all', ...Array.from(new Set(items.map(i => i.event_date ? new Date(i.event_date).getFullYear().toString() : null).filter(Boolean))).sort((a: any, b: any) => b - a)]
  const albums = ['all', ...Array.from(new Set(items.map(i => i.album).filter(Boolean)))]

  // Filtrage
  const filtered = items.filter(i => {
    const matchCat = filterCategory === 'all' || i.category === filterCategory
    const matchYear = filterYear === 'all' || (i.event_date && new Date(i.event_date).getFullYear().toString() === filterYear)
    const matchAlbum = filterAlbum === 'all' || i.album === filterAlbum
    return matchCat && matchYear && matchAlbum
  })

  // Grouper par album pour affichage
  const albumsToShow = filterAlbum === 'all'
    ? Array.from(new Set(filtered.map(i => i.album || 'Sans album')))
    : [filterAlbum]

  // Navigation lightbox
  const openLightbox = (item: any) => {
    const index = filtered.findIndex(i => i.id === item.id)
    setLightbox({ item, index })
  }

  const prevPhoto = () => {
    if (!lightbox) return
    const newIndex = (lightbox.index - 1 + filtered.length) % filtered.length
    setLightbox({ item: filtered[newIndex], index: newIndex })
  }

  const nextPhoto = () => {
    if (!lightbox) return
    const newIndex = (lightbox.index + 1) % filtered.length
    setLightbox({ item: filtered[newIndex], index: newIndex })
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightbox) return
      if (e.key === 'ArrowLeft') prevPhoto()
      if (e.key === 'ArrowRight') nextPhoto()
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightbox])

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-white">Galerie</h1>
          <p className="text-white/80 mt-4">Les moments forts de notre communauté</p>
          {!loading && <p className="text-white/60 text-sm mt-2">{items.length} photos · {albums.length - 1} albums</p>}
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">

          {/* Filtres */}
          {!loading && items.length > 0 && (
            <div className="bg-white rounded-2xl border p-4 mb-8 space-y-3">
              {/* Filtre par année */}
              {years.length > 2 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-gray-500 font-semibold w-16">Année</span>
                  {years.map(y => (
                    <button key={y} onClick={() => setFilterYear(y)}
                      className={`text-sm px-3 py-1 rounded-full font-semibold transition-all ${filterYear === y ? 'bg-vert text-white' : 'bg-gray-100 text-gray-600 hover:bg-vert-50 hover:text-vert'}`}>
                      {y === 'all' ? 'Toutes' : y}
                    </button>
                  ))}
                </div>
              )}

              {/* Filtre par catégorie */}
              {categories.length > 2 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-gray-500 font-semibold w-16">Type</span>
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setFilterCategory(cat)}
                      className={`text-sm px-3 py-1 rounded-full font-semibold transition-all ${filterCategory === cat ? 'bg-vert text-white' : 'bg-gray-100 text-gray-600 hover:bg-vert-50 hover:text-vert'}`}>
                      {cat === 'all' ? 'Tous' : cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Filtre par album */}
              {albums.length > 2 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-gray-500 font-semibold w-16">Album</span>
                  <div className="flex flex-wrap gap-1.5">
                    {albums.map(a => (
                      <button key={a} onClick={() => setFilterAlbum(a)}
                        className={`text-sm px-3 py-1 rounded-full font-semibold transition-all ${filterAlbum === a ? 'bg-vert text-white' : 'bg-gray-100 text-gray-600 hover:bg-vert-50 hover:text-vert'}`}>
                        {a === 'all' ? '📷 Tous les albums' : `📁 ${a}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Lightbox */}
          {lightbox && (
            <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={() => setLightbox(null)}>
              <button className="absolute top-4 right-4 text-white/70 hover:text-white z-10" onClick={() => setLightbox(null)}>
                <X className="w-8 h-8" />
              </button>
              <button className="absolute left-4 text-white/70 hover:text-white z-10 p-2" onClick={e => { e.stopPropagation(); prevPhoto() }}>
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button className="absolute right-4 text-white/70 hover:text-white z-10 p-2" onClick={e => { e.stopPropagation(); nextPhoto() }}>
                <ChevronRight className="w-8 h-8" />
              </button>
              <div className="max-w-5xl max-h-[85vh] px-16" onClick={e => e.stopPropagation()}>
                <img src={lightbox.item.image_url} alt={lightbox.item.caption || ''}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg mx-auto" />
                <div className="text-center mt-3">
                  {lightbox.item.caption && <p className="text-white font-medium">{lightbox.item.caption}</p>}
                  <p className="text-white/50 text-sm mt-1">
                    {lightbox.item.album && `📁 ${lightbox.item.album}`}
                    {lightbox.item.event_date && ` · 📅 ${new Date(lightbox.item.event_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                  </p>
                  <p className="text-white/30 text-xs mt-1">{lightbox.index + 1} / {filtered.length}</p>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-vert border-t-transparent rounded-full" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Camera className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Aucune photo pour ces filtres.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {albumsToShow.map(albumName => {
                const albumItems = filtered.filter(i => (i.album || 'Sans album') === albumName)
                if (!albumItems.length) return null
                const firstItem = albumItems[0]
                return (
                  <div key={albumName}>
                    {/* En-tête album */}
                    <div className="flex items-center gap-3 mb-4">
                      <FolderOpen className="w-5 h-5 text-vert" />
                      <div>
                        <h2 className="font-heading font-bold text-lg text-gray-900">{albumName}</h2>
                        <p className="text-xs text-gray-400">
                          {albumItems.length} photo(s)
                          {firstItem?.event_date && ` · ${new Date(firstItem.event_date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`}
                          {firstItem?.category && ` · ${firstItem.category}`}
                        </p>
                      </div>
                    </div>
                    {/* Photos en masonry */}
                    <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
                      {albumItems.map(item => (
                        <div key={item.id} onClick={() => openLightbox(item)}
                          className="break-inside-avoid cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                          <div className="relative overflow-hidden">
                            <img src={item.image_url} alt={item.caption || ''}
                              className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            {item.caption && (
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-white text-xs font-medium">{item.caption}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
