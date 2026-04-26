'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { MapPin, Phone, Globe, Star, Tag, ChevronRight, X, Loader2, CheckCircle } from 'lucide-react'

const categories = ['Tous', 'Alimentation halal', 'Restaurant', 'Transport', 'Automobile', 'Beauté & Coiffure', 'Santé', 'Immobilier', 'Commerce', 'Autre']

const forfaits = [
  {
    nom: 'Basique',
    prix: 10,
    couleur: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-600',
    desc: 'Visibilité essentielle',
    features: ['Nom & téléphone', 'Catégorie', 'Adresse', 'Durée 1 mois'],
  },
  {
    nom: 'Standard',
    prix: 25,
    couleur: 'border-vert-400',
    badge: 'bg-vert-50 text-vert',
    desc: 'Recommandé',
    features: ['Tout Basique', 'Logo + photo', 'Description', 'Lien site web', 'Offre spéciale membres'],
    popular: true,
  },
  {
    nom: 'Premium',
    prix: 50,
    couleur: 'border-yellow-400',
    badge: 'bg-yellow-50 text-yellow-700',
    desc: 'Mise en avant maximale',
    features: ['Tout Standard', 'Badge ⭐ Premium', 'Position prioritaire', 'Encadré doré', 'Partage sur Facebook AEAB'],
  },
]

export default function ProfessionnelsPage() {
  const [pubs, setPubs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Tous')
  const [showForm, setShowForm] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedForfait, setSelectedForfait] = useState('Standard')
  const [sel, setSel] = useState<any>(null)
  const [form, setForm] = useState({
    nom_entreprise: '', categorie: '', description: '', adresse: '',
    telephone: '', email: '', site_web: '', promo: '',
    contact_nom: '', contact_email: '', contact_telephone: '',
  })

  useEffect(() => {
    supabase.from('publicites').select('*').eq('statut', 'valide')
      .order('forfait', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => { setPubs(data || []); setLoading(false) })
  }, [])

  const filtered = filter === 'Tous' ? pubs : pubs.filter(p => p.categorie === filter)
  const premium = filtered.filter(p => p.forfait === 'premium')
  const autres = filtered.filter(p => p.forfait !== 'premium')

  const handleSubmit = async () => {
    if (!form.nom_entreprise || !form.contact_email) return
    setSubmitting(true)
    const prix = forfaits.find(f => f.nom === selectedForfait)?.prix || 10
    await supabase.from('publicites').insert([{
      ...form,
      forfait: selectedForfait.toLowerCase(),
      prix_mensuel: prix,
      statut: 'en_attente',
    }])
    setSubmitting(false)
    setSuccess(true)
    setShowForm(false)
    setTimeout(() => setSuccess(false), 6000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="hero-gradient py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full mb-4">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-white/90">Espace Professionnels</span>
          </div>
          <h1 className="font-heading text-4xl font-bold text-white mb-4">
            Touchez la communauté algérienne de Bordeaux
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Faites connaître votre entreprise à plus de 200 étudiants et familles algériennes. 
            Vos revenus publicitaires soutiennent directement les actions solidaires de l&apos;AEAB.
          </p>
          <button onClick={() => setShowForm(true)}
            className="bg-white text-vert px-8 py-3.5 rounded-xl font-bold hover:bg-white/90 transition-all shadow-lg">
            📢 Publier mon annonce pro
          </button>
        </div>
      </section>

      {/* Forfaits */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl font-bold text-gray-900">Nos forfaits</h2>
            <p className="text-gray-500 mt-2">100% des revenus financent les actions solidaires de l&apos;AEAB</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {forfaits.map(f => (
              <div key={f.nom} className={`bg-white rounded-2xl border-2 p-6 relative ${f.couleur} ${f.popular ? 'shadow-lg' : ''}`}>
                {f.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-vert text-white text-xs font-bold px-4 py-1 rounded-full">
                    ⭐ Recommandé
                  </div>
                )}
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${f.badge}`}>{f.desc}</span>
                <div className="mt-3 mb-4">
                  <h3 className="font-heading font-bold text-xl">{f.nom}</h3>
                  <div className="text-3xl font-bold text-vert mt-1">{f.prix}€<span className="text-sm text-gray-400 font-normal">/mois</span></div>
                </div>
                <ul className="space-y-2 mb-6">
                  {f.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-vert flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <button onClick={() => { setSelectedForfait(f.nom); setShowForm(true) }}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${f.popular ? 'bg-vert text-white hover:bg-vert-700' : 'border-2 border-vert text-vert hover:bg-vert-50'}`}>
                  Choisir {f.nom}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Annuaire pros */}
      <section className="py-10 max-w-6xl mx-auto px-4">
        {success && (
          <div className="bg-vert-50 border border-vert-200 rounded-xl p-4 mb-6 flex items-center gap-3 text-vert">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-bold">Demande envoyée !</p>
              <p className="text-sm">L&apos;équipe AEAB vous contactera sous 24h pour valider et organiser le paiement.</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="font-heading text-2xl font-bold text-gray-900">Annuaire des professionnels</h2>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm flex items-center gap-2">
            📢 Rejoindre l&apos;annuaire
          </button>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${filter === cat ? 'bg-vert text-white' : 'bg-white border text-gray-600 hover:border-vert'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Modal détail */}
        {sel && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSel(null)}>
            <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {sel.logo_url
                    ? <img src={sel.logo_url} alt={sel.nom_entreprise} className="w-14 h-14 rounded-xl object-cover" />
                    : <div className="w-14 h-14 rounded-xl bg-vert-100 flex items-center justify-center text-2xl font-bold text-vert">{sel.nom_entreprise[0]}</div>}
                  <div>
                    <h3 className="font-heading font-bold text-lg">{sel.nom_entreprise}</h3>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{sel.categorie}</span>
                    {sel.forfait === 'premium' && <span className="ml-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">⭐ Premium</span>}
                  </div>
                </div>
                <button onClick={() => setSel(null)}><X className="w-5 h-5" /></button>
              </div>
              {sel.photo_url && <img src={sel.photo_url} alt="" className="w-full h-40 object-cover rounded-xl mb-4" />}
              {sel.description && <p className="text-gray-600 text-sm mb-4">{sel.description}</p>}
              {sel.promo && (
                <div className="bg-rouge-50 border border-rouge-200 rounded-xl p-3 mb-4">
                  <p className="text-xs font-bold text-rouge mb-1">🎁 Offre spéciale membres AEAB</p>
                  <p className="text-sm text-gray-700">{sel.promo}</p>
                </div>
              )}
              <div className="space-y-2">
                {sel.adresse && <p className="flex items-center gap-2 text-sm text-gray-600"><MapPin className="w-4 h-4 text-vert" />{sel.adresse}</p>}
                {sel.telephone && <a href={`tel:${sel.telephone}`} className="flex items-center gap-2 text-sm text-vert hover:underline"><Phone className="w-4 h-4" />{sel.telephone}</a>}
                {sel.site_web && <a href={sel.site_web} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-vert hover:underline"><Globe className="w-4 h-4" />Site web</a>}
              </div>
            </div>
          </div>
        )}

        {/* Modal formulaire */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-lg">📢 Publier mon annonce</h3>
                <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
              </div>

              {/* Sélection forfait */}
              <div className="mb-5">
                <label className="form-label mb-2 block">Choisir un forfait</label>
                <div className="grid grid-cols-3 gap-2">
                  {forfaits.map(f => (
                    <button key={f.nom} onClick={() => setSelectedForfait(f.nom)}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${selectedForfait === f.nom ? 'border-vert bg-vert-50' : 'border-gray-200'}`}>
                      <p className="font-bold text-sm">{f.nom}</p>
                      <p className="text-vert font-bold">{f.prix}€/mois</p>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-vert mt-2 text-center">💚 Vos paiements financent les actions solidaires de l&apos;AEAB</p>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="form-label">Nom de l&apos;entreprise *</label>
                    <input className="form-input" value={form.nom_entreprise} onChange={e => setForm(f => ({ ...f, nom_entreprise: e.target.value }))} />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Catégorie *</label>
                    <select className="form-input" value={form.categorie} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}>
                      <option value="">Sélectionner</option>
                      {categories.filter(c => c !== 'Tous').map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Description</label>
                    <textarea rows={3} className="form-input" placeholder="Décrivez votre activité..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Adresse</label>
                    <input className="form-input" placeholder="Ex: 12 rue Victor Hugo, Bordeaux" value={form.adresse} onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label">Téléphone</label>
                    <input className="form-input" value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label">Site web</label>
                    <input className="form-input" placeholder="https://..." value={form.site_web} onChange={e => setForm(f => ({ ...f, site_web: e.target.value }))} />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">🎁 Offre spéciale membres AEAB</label>
                    <input className="form-input" placeholder="Ex: 10% de réduction sur présentation de la carte membre" value={form.promo} onChange={e => setForm(f => ({ ...f, promo: e.target.value }))} />
                  </div>
                </div>

                <div className="border-t pt-3 mt-3">
                  <p className="text-xs font-bold text-gray-600 mb-2">Vos coordonnées (contact admin)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">Votre nom *</label>
                      <input className="form-input" value={form.contact_nom} onChange={e => setForm(f => ({ ...f, contact_nom: e.target.value }))} />
                    </div>
                    <div>
                      <label className="form-label">Email *</label>
                      <input type="email" className="form-input" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} />
                    </div>
                    <div className="col-span-2">
                      <label className="form-label">Téléphone</label>
                      <input className="form-input" value={form.contact_telephone} onChange={e => setForm(f => ({ ...f, contact_telephone: e.target.value }))} />
                    </div>
                  </div>
                </div>

                <div className="bg-vert-50 border border-vert-200 rounded-xl p-3 text-xs text-vert">
                  💚 Forfait sélectionné : <strong>{selectedForfait} — {forfaits.find(f => f.nom === selectedForfait)?.prix}€/mois</strong><br/>
                  L&apos;équipe AEAB vous contactera sous 24h pour valider et organiser le paiement.
                </div>

                <button onClick={handleSubmit} disabled={!form.nom_entreprise || !form.contact_email || submitting}
                  className="btn-primary w-full flex items-center justify-center gap-2">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi...</> : '📢 Envoyer ma demande'}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-vert border-t-transparent rounded-full" /></div>
        ) : filtered.length > 0 ? (
          <div className="space-y-8">
            {/* Premium en premier */}
            {premium.length > 0 && (
              <div>
                <h3 className="font-heading font-bold text-lg mb-3 flex items-center gap-2">⭐ Partenaires Premium</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {premium.map(p => (
                    <div key={p.id} onClick={() => setSel(p)}
                      className="bg-white rounded-2xl border-2 border-yellow-300 p-5 cursor-pointer hover:shadow-lg transition-shadow relative">
                      <div className="absolute top-3 right-3 bg-yellow-50 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">⭐ Premium</div>
                      <div className="flex items-start gap-4">
                        {p.logo_url
                          ? <img src={p.logo_url} alt={p.nom_entreprise} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                          : <div className="w-16 h-16 rounded-xl bg-yellow-50 flex items-center justify-center text-2xl font-bold text-yellow-600 flex-shrink-0">{p.nom_entreprise[0]}</div>}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading font-bold text-lg">{p.nom_entreprise}</h3>
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{p.categorie}</span>
                          {p.description && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{p.description}</p>}
                          {p.promo && <p className="text-xs text-rouge font-semibold mt-2">🎁 {p.promo}</p>}
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            {p.adresse && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.adresse}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Autres */}
            {autres.length > 0 && (
              <div>
                {premium.length > 0 && <h3 className="font-heading font-bold text-lg mb-3">Autres professionnels</h3>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {autres.map(p => (
                    <div key={p.id} onClick={() => setSel(p)}
                      className="bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        {p.logo_url
                          ? <img src={p.logo_url} alt={p.nom_entreprise} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                          : <div className="w-12 h-12 rounded-lg bg-vert-50 flex items-center justify-center text-xl font-bold text-vert flex-shrink-0">{p.nom_entreprise[0]}</div>}
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{p.nom_entreprise}</h3>
                          <span className="text-xs text-gray-500">{p.categorie}</span>
                        </div>
                      </div>
                      {p.description && <p className="text-xs text-gray-500 line-clamp-2 mb-2">{p.description}</p>}
                      {p.promo && <p className="text-xs text-rouge font-semibold">🎁 {p.promo}</p>}
                      {p.adresse && <p className="text-xs text-gray-400 flex items-center gap-1 mt-2"><MapPin className="w-3 h-3" />{p.adresse}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-4">🏪</div>
            <p className="text-lg font-semibold">Aucun professionnel pour le moment</p>
            <p className="text-sm mt-2">Soyez le premier à rejoindre l&apos;annuaire AEAB !</p>
            <button onClick={() => setShowForm(true)} className="btn-primary mt-4 inline-block text-sm">
              📢 Publier mon annonce
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
