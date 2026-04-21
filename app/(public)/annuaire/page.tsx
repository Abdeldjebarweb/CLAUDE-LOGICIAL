'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, User, MapPin, GraduationCap, Lock } from 'lucide-react'

export default function AnnuairePage() {
  const [membres, setMembres] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filterVille, setFilterVille] = useState('')
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('aeab_membre')
    if (saved) setIsLoggedIn(true)

    supabase.from('membre_accounts')
      .select('id, prenom, nom, etablissement, filiere, niveau, ville, bio, photo_url, statut_adhesion')
      .eq('visible_annuaire', true)
      .eq('statut_adhesion', 'membre_actif')
      .order('prenom')
      .then(({ data }) => {
        setMembres(data || [])
        setLoading(false)
      })
  }, [])

  const filtered = membres.filter(m => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      `${m.prenom} ${m.nom}`.toLowerCase().includes(q) ||
      (m.etablissement || '').toLowerCase().includes(q) ||
      (m.filiere || '').toLowerCase().includes(q)
    const matchVille = !filterVille || (m.ville || '').toLowerCase().includes(filterVille.toLowerCase())
    return matchSearch && matchVille
  })

  if (!isLoggedIn) return (
    <div className="min-h-screen bg-gray-50">
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-white">Annuaire des membres</h1>
          <p className="text-white/80 mt-4">Retrouvez les étudiants algériens de Bordeaux</p>
        </div>
      </section>
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="font-heading text-2xl font-bold text-gray-900 mb-3">Accès réservé aux membres</h2>
        <p className="text-gray-500 mb-6">Connectez-vous ou créez un compte pour accéder à l&apos;annuaire.</p>
        <a href="/membre" className="btn-primary">Accéder à l&apos;espace membre</a>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-white">Annuaire des membres</h1>
          <p className="text-white/80 mt-4">{membres.length} étudiant(s) algérien(s) à Bordeaux</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Recherche */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input className="form-input pl-9" placeholder="Rechercher par nom, établissement..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <input className="form-input w-48" placeholder="Filtrer par ville..."
              value={filterVille} onChange={e => setFilterVille(e.target.value)} />
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-vert border-t-transparent rounded-full" />
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(m => (
                <div key={m.id} className="card p-5 hover:-translate-y-1 transition-transform">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-vert-100 flex items-center justify-center text-vert text-xl font-heading font-bold flex-shrink-0 overflow-hidden">
                      {m.photo_url ? (
                        <img src={m.photo_url} alt={m.prenom} className="w-full h-full object-cover" />
                      ) : (
                        `${m.prenom?.[0]}${m.nom?.[0]}`
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{m.prenom} {m.nom}</h3>
                      {m.etablissement && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <GraduationCap className="w-3 h-3" />
                          <span className="truncate">{m.etablissement}</span>
                        </div>
                      )}
                      {m.filiere && <p className="text-xs text-vert mt-0.5">{m.filiere} {m.niveau ? `• ${m.niveau}` : ''}</p>}
                      {m.ville && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{m.ville}</span>
                        </div>
                      )}
                      {m.bio && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{m.bio}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <User className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Aucun membre trouvé.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
