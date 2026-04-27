'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Briefcase, MapPin, Clock, Euro, ExternalLink , Lock } from 'lucide-react'

const typeColors: Record<string, string> = {
  'Stage': 'bg-blue-50 text-blue-600',
  'CDI': 'bg-vert-50 text-vert',
  'CDD': 'bg-yellow-50 text-yellow-700',
  'Alternance': 'bg-purple-50 text-purple-600',
  'Freelance': 'bg-orange-50 text-orange-600',
  'Bénévolat': 'bg-rouge-50 text-rouge',
}

export default function AnnoncesPage() {
  // Protection membre
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const [annonces, setAnnonces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const types = ['Stage', 'CDI', 'CDD', 'Alternance', 'Freelance', 'Bénévolat']

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session?.user)
      setCheckingAuth(false)
    })
    supabase.from('annonces_emploi').select('*')
      .eq('statut', 'publiee')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setAnnonces(data || []); setLoading(false) })
  }, [])

  const filtered = filter === 'all' ? annonces : annonces.filter(a => a.type === filter)

  if (checkingAuth) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-vert border-t-transparent rounded-full" />
    </div>
  )

  if (!isLoggedIn) return (
    <div className="min-h-screen bg-gray-50">
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-white">Accès réservé</h1>
          <p className="text-white/80 mt-4">Cette page est réservée aux membres de l&apos;AEAB</p>
        </div>
      </section>
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-gray-900 mb-3">Membres uniquement</h2>
        <p className="text-gray-500 mb-6">Connectez-vous ou créez un compte membre pour accéder à cette page.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="/connexion" className="btn-primary">Se connecter</a>
          <a href="/membre" className="btn-outline">Créer un compte</a>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-white">💼 Emploi & Stages</h1>
          <p className="text-white/80 mt-4">Offres sélectionnées par l&apos;équipe AEAB pour nos membres</p>
        </div>
      </section>

      <section className="py-10 max-w-5xl mx-auto px-4">
        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setFilter('all')}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold ${filter === 'all' ? 'bg-vert text-white' : 'bg-white border text-gray-600'}`}>
            Toutes
          </button>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold ${filter === t ? 'bg-vert text-white' : 'bg-white border text-gray-600'}`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-vert border-t-transparent rounded-full" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map(a => (
              <div key={a.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-heading font-bold text-lg">{a.titre}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${typeColors[a.type] || 'bg-gray-100 text-gray-500'}`}>
                        {a.type}
                      </span>
                      {a.domaine && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{a.domaine}</span>
                      )}
                    </div>
                    {a.entreprise && <p className="font-semibold text-gray-700 text-sm mb-2">{a.entreprise}</p>}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                      {a.lieu && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{a.lieu}</span>}
                      {a.duree && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.duree}</span>}
                      {a.remuneration && <span className="flex items-center gap-1"><Euro className="w-3 h-3" />{a.remuneration}</span>}
                    </div>
                    {a.description && <p className="text-sm text-gray-600 leading-relaxed">{a.description}</p>}
                  </div>
                  {a.contact && (
                    <a href={a.contact.startsWith('http') ? a.contact : a.contact.includes('@') ? `mailto:${a.contact}` : `tel:${a.contact}`}
                      target="_blank" rel="noopener noreferrer"
                      className="btn-primary text-sm flex items-center gap-2 flex-shrink-0">
                      <ExternalLink className="w-4 h-4" /> Postuler
                    </a>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Publié le {new Date(a.created_at).toLocaleDateString('fr-FR')} par l&apos;équipe AEAB
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Aucune annonce pour le moment.</p>
            <p className="text-sm mt-2">Revenez bientôt — l&apos;équipe AEAB publie régulièrement des offres.</p>
            <a href="/contact" className="btn-primary mt-4 inline-block text-sm">Nous signaler une offre</a>
          </div>
        )}
      </section>
    </div>
  )
}
