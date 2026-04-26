'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Briefcase, Plus, MapPin, Clock, Euro, X, Loader2, CheckCircle } from 'lucide-react'

const types = ['Stage', 'CDI', 'CDD', 'Alternance', 'Freelance', 'Bénévolat']
const domaines = ['Informatique', 'Commerce', 'Marketing', 'Médecine', 'Droit', 'Ingénierie', 'Architecture', 'Finance', 'Autre']

export default function AnnoncesPage() {
  const [annonces, setAnnonces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    titre: '', entreprise: '', lieu: 'Bordeaux', type: 'Stage',
    domaine: '', description: '', remuneration: '', contact: '', duree: ''
  })

  useEffect(() => {
    supabase.from('annonces_emploi').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setAnnonces(data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async () => {
    if (!form.titre || !form.contact) return
    setSubmitting(true)
    const { error } = await supabase.from('annonces_emploi').insert([{ ...form, statut: 'en_attente' }])
    setSubmitting(false)
    if (!error) { setSuccess(true); setShowForm(false); setTimeout(() => setSuccess(false), 5000) }
  }

  const filtered = filter === 'all' ? annonces : annonces.filter(a => a.type === filter)

  const typeColors: Record<string, string> = {
    'Stage': 'bg-blue-50 text-blue-600',
    'CDI': 'bg-vert-50 text-vert',
    'CDD': 'bg-yellow-50 text-yellow-700',
    'Alternance': 'bg-purple-50 text-purple-600',
    'Freelance': 'bg-orange-50 text-orange-600',
    'Bénévolat': 'bg-rouge-50 text-rouge',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-white">💼 Annonces emploi & stage</h1>
          <p className="text-white/80 mt-4">Offres partagées par et pour la communauté AEAB</p>
        </div>
      </section>

      <section className="py-10 max-w-5xl mx-auto px-4">
        {success && (
          <div className="bg-vert-50 border border-vert-200 rounded-xl p-4 mb-6 flex items-center gap-3 text-vert">
            <CheckCircle className="w-5 h-5" />
            <p className="font-semibold">Annonce soumise ! Elle sera visible après validation par l&apos;admin.</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilter('all')} className={`text-xs px-3 py-1.5 rounded-full font-semibold ${filter === 'all' ? 'bg-vert text-white' : 'bg-white border text-gray-600'}`}>Toutes</button>
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)} className={`text-xs px-3 py-1.5 rounded-full font-semibold ${filter === t ? 'bg-vert text-white' : 'bg-white border text-gray-600'}`}>{t}</button>
            ))}
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Publier une annonce
          </button>
        </div>

        {/* Modal formulaire */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-lg">Publier une annonce</h3>
                <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div><label className="form-label">Titre du poste *</label>
                  <input className="form-input" placeholder="Ex: Stage développeur web" value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="form-label">Entreprise</label>
                    <input className="form-input" value={form.entreprise} onChange={e => setForm(f => ({ ...f, entreprise: e.target.value }))} /></div>
                  <div><label className="form-label">Lieu</label>
                    <input className="form-input" value={form.lieu} onChange={e => setForm(f => ({ ...f, lieu: e.target.value }))} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="form-label">Type</label>
                    <select className="form-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                      {types.map(t => <option key={t}>{t}</option>)}</select></div>
                  <div><label className="form-label">Domaine</label>
                    <select className="form-input" value={form.domaine} onChange={e => setForm(f => ({ ...f, domaine: e.target.value }))}>
                      <option value="">Sélectionner</option>
                      {domaines.map(d => <option key={d}>{d}</option>)}</select></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="form-label">Durée</label>
                    <input className="form-input" placeholder="Ex: 6 mois" value={form.duree} onChange={e => setForm(f => ({ ...f, duree: e.target.value }))} /></div>
                  <div><label className="form-label">Rémunération</label>
                    <input className="form-input" placeholder="Ex: 600€/mois" value={form.remuneration} onChange={e => setForm(f => ({ ...f, remuneration: e.target.value }))} /></div>
                </div>
                <div><label className="form-label">Description</label>
                  <textarea rows={3} className="form-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
                <div><label className="form-label">Contact *</label>
                  <input className="form-input" placeholder="Email ou téléphone" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} /></div>
                <button onClick={handleSubmit} disabled={!form.titre || !form.contact || submitting}
                  className="btn-primary w-full flex items-center justify-center gap-2">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi...</> : 'Soumettre l\'annonce'}
                </button>
                <p className="text-xs text-gray-400 text-center">L&apos;annonce sera vérifiée avant publication</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-vert border-t-transparent rounded-full" /></div>
        ) : filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map(a => (
              <div key={a.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-heading font-bold text-lg">{a.titre}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${typeColors[a.type] || 'bg-gray-100 text-gray-500'}`}>{a.type}</span>
                      {a.domaine && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{a.domaine}</span>}
                    </div>
                    {a.entreprise && <p className="font-semibold text-gray-700 text-sm">{a.entreprise}</p>}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-2">
                      {a.lieu && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{a.lieu}</span>}
                      {a.duree && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.duree}</span>}
                      {a.remuneration && <span className="flex items-center gap-1"><Euro className="w-3 h-3" />{a.remuneration}</span>}
                    </div>
                    {a.description && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{a.description}</p>}
                  </div>
                  {a.contact && (
                    <a href={a.contact.includes('@') ? `mailto:${a.contact}` : `tel:${a.contact}`}
                      className="btn-primary text-sm flex-shrink-0">Postuler</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Aucune annonce pour le moment.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary mt-4 text-sm">Publier la première annonce</button>
          </div>
        )}
      </section>
    </div>
  )
}
