'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Car, Search, Plus, X, MapPin, Calendar, Users, Euro, Phone, CheckCircle, Loader2 } from 'lucide-react'

export default function CovoituragePage() {
  const [trajets, setTrajets] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState<'offres' | 'recherches'>('offres')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    type: 'offre', nom_contact: '', email_contact: '', telephone: '',
    depart: '', arrivee: '', date_trajet: '', heure_depart: '',
    nb_places: '1', prix_par_place: '0', commentaire: '',
  })

  const load = async () => {
    const { data } = await supabase.from('covoiturages').select('*').eq('actif', true).order('date_trajet', { ascending: true })
    setTrajets(data || [])
  }
  useEffect(() => { load() }, [])

  const filtered = trajets.filter(t => {
    const q = search.toLowerCase()
    const matchType = tab === 'offres' ? t.type === 'offre' : t.type === 'recherche'
    const matchSearch = !q || t.depart.toLowerCase().includes(q) || t.arrivee.toLowerCase().includes(q)
    return matchType && matchSearch
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await supabase.from('covoiturages').insert([{
      statut: 'en_attente',
      actif: false,
      ...form,
      nb_places: parseInt(form.nb_places),
      prix_par_place: parseFloat(form.prix_par_place),
    }])
    setLoading(false)
    setSuccess(true)
    setShowForm(false)
    load()
    setTimeout(() => setSuccess(false), 4000)
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value })

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-white">Covoiturage AEAB</h1>
          <p className="text-white/80 mt-4">Partagez vos trajets avec d&apos;autres étudiants algériens de Bordeaux</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4">

          {success && (
            <div className="flex items-center gap-3 bg-vert-50 border border-vert-200 rounded-xl p-4 mb-6 text-vert">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold text-sm">Votre trajet a été publié avec succès !</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
              {[
                { key: 'offres', label: `🚗 Offres (${trajets.filter(t => t.type === 'offre').length})` },
                { key: 'recherches', label: `🔍 Recherches (${trajets.filter(t => t.type === 'recherche').length})` },
              ].map(t => (
                <button key={t.key} onClick={() => setTab(t.key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.key ? 'bg-white shadow text-vert' : 'text-gray-500'}`}>
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={() => setShowForm(true)} className="btn-primary text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Publier un trajet
            </button>
          </div>

          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="form-input pl-9" placeholder="Rechercher par départ ou arrivée..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {/* Modal formulaire */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
              <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-lg">Publier un trajet</h3>
                  <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="form-label">Type *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[{ v: 'offre', label: '🚗 J\'offre une place' }, { v: 'recherche', label: '🔍 Je cherche un trajet' }].map(o => (
                        <button key={o.v} type="button"
                          onClick={() => setForm({ ...form, type: o.v })}
                          className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${form.type === o.v ? 'border-vert bg-vert-50 text-vert' : 'border-gray-200 text-gray-600'}`}>
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="form-label">Nom *</label><input required className="form-input" value={form.nom_contact} onChange={set('nom_contact')} /></div>
                    <div><label className="form-label">Téléphone</label><input className="form-input" value={form.telephone} onChange={set('telephone')} /></div>
                  </div>
                  <div><label className="form-label">Email *</label><input required type="email" className="form-input" value={form.email_contact} onChange={set('email_contact')} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="form-label">Départ *</label><input required className="form-input" placeholder="Ex: Bordeaux" value={form.depart} onChange={set('depart')} /></div>
                    <div><label className="form-label">Arrivée *</label><input required className="form-input" placeholder="Ex: Paris" value={form.arrivee} onChange={set('arrivee')} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="form-label">Date *</label><input required type="date" className="form-input" value={form.date_trajet} onChange={set('date_trajet')} /></div>
                    <div><label className="form-label">Heure</label><input className="form-input" placeholder="Ex: 08h30" value={form.heure_depart} onChange={set('heure_depart')} /></div>
                  </div>
                  {form.type === 'offre' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="form-label">Places dispo</label><input type="number" min="1" max="8" className="form-input" value={form.nb_places} onChange={set('nb_places')} /></div>
                      <div><label className="form-label">Prix/place (€)</label><input type="number" min="0" className="form-input" value={form.prix_par_place} onChange={set('prix_par_place')} /></div>
                    </div>
                  )}
                  <div><label className="form-label">Commentaire</label><textarea rows={3} className="form-input" placeholder="Infos complémentaires..." value={form.commentaire} onChange={set('commentaire')} /></div>
                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Car className="w-4 h-4" />} Publier
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Trajets */}
          {filtered.length > 0 ? (
            <div className="space-y-4">
              {filtered.map(t => (
                <div key={t.id} className="card p-5 hover:-translate-y-0.5 transition-transform">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2 font-heading font-bold text-lg text-gray-900">
                          <MapPin className="w-4 h-4 text-rouge" />
                          {t.depart}
                          <span className="text-gray-400 font-normal">→</span>
                          <MapPin className="w-4 h-4 text-vert" />
                          {t.arrivee}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(t.date_trajet).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        {t.heure_depart && <span>🕐 {t.heure_depart}</span>}
                        {t.type === 'offre' && t.nb_places && <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{t.nb_places} place(s)</span>}
                        {t.prix_par_place > 0 && <span className="flex items-center gap-1"><Euro className="w-3.5 h-3.5" />{t.prix_par_place}€/place</span>}
                        {t.prix_par_place === 0 && t.type === 'offre' && <span className="text-vert font-semibold">Gratuit</span>}
                      </div>
                      {t.commentaire && <p className="text-sm text-gray-500 mt-2 italic">&ldquo;{t.commentaire}&rdquo;</p>}
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span className="text-xs font-bold text-gray-700">{t.nom_contact}</span>
                      {t.telephone && (
                        <a href={`tel:${t.telephone}`} className="flex items-center gap-1.5 text-sm text-vert hover:underline">
                          <Phone className="w-3.5 h-3.5" />{t.telephone}
                        </a>
                      )}
                      <a href={`mailto:${t.email_contact}`} className="text-xs text-gray-400 hover:text-vert hover:underline">
                        {t.email_contact}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <Car className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Aucun trajet disponible pour le moment.</p>
              <button onClick={() => setShowForm(true)} className="text-vert text-sm mt-2 hover:underline">
                + Soyez le premier à publier un trajet
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
