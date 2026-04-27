'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plane, Plus, X, MapPin, Calendar, Package, Phone, Mail, CheckCircle, Loader2, Info , Lock } from 'lucide-react'

const TYPES = [
  { value: 'medicaments', label: '💊 Médicaments', desc: 'Ordonnances, boîtes de médicaments' },
  { value: 'papiers', label: '📄 Documents & papiers', desc: 'Actes, diplômes, dossiers officiels' },
  { value: 'petits_colis', label: '📦 Petits colis', desc: 'Petits objets, cadeaux légers' },
  { value: 'vetements', label: '👕 Vêtements', desc: 'Habits, affaires personnelles' },
  { value: 'autre', label: '🔹 Autre', desc: 'Préciser dans les commentaires' },
]

const VILLES_ALGERIE = ['Alger', 'Oran', 'Constantine', 'Annaba', 'Sétif', 'Tlemcen', 'Béjaïa', 'Tizi Ouzou', 'Blida', 'Batna', 'Autre ville']

export default function TransporteursPage() {
  // Protection membre
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const [annonces, setAnnonces] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [filterVille, setFilterVille] = useState('')
  const [sel, setSel] = useState<any>(null)

  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '',
    depart: 'Bordeaux', arrivee: '',
    date_voyage: '', date_retour: '',
    aller_retour: false,
    types_acceptes: [] as string[],
    poids_max: '', commentaire: '',
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session?.user)
      setCheckingAuth(false)
    })
    supabase.from('transporteurs')
      .select('*')
      .eq('visible', true)
      .eq('statut', 'valide')
      .order('date_voyage', { ascending: true })
      .then(({ data }) => setAnnonces(data || []))
  }, [])

  const toggleType = (t: string) => {
    setForm(prev => ({
      ...prev,
      types_acceptes: prev.types_acceptes.includes(t)
        ? prev.types_acceptes.filter(x => x !== t)
        : [...prev.types_acceptes, t],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.types_acceptes.length === 0) {
      alert('Sélectionnez au moins un type d\'objet accepté.')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('transporteurs').insert([{
      ...form,
      poids_max: form.poids_max ? parseFloat(form.poids_max) : null,
      date_retour: form.date_retour || null,
      statut: 'en_attente',
      visible: false,
    }])
    setLoading(false)
    setSuccess(true)
    setShowForm(false)
  }

  const filtered = annonces.filter(a =>
    !filterVille || a.arrivee.toLowerCase().includes(filterVille.toLowerCase())
  )

  const getTypeLabel = (v: string) => TYPES.find(t => t.value === v)?.label || v

  if (success) return (
    <div className="min-h-screen bg-gray-50">
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-white">Transporteurs solidaires</h1>
        </div>
      </section>
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-vert-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-vert" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-gray-900 mb-3">Annonce envoyée !</h2>
        <p className="text-gray-500">Votre annonce est en cours de vérification par l&apos;équipe AEAB. Elle sera publiée après validation, généralement sous 24h.</p>
        <button onClick={() => setSuccess(false)} className="btn-primary mt-6">Voir les annonces</button>
      </div>
    </div>
  )

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
      {/* Hero */}
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white">✈️ Transporteurs solidaires</h1>
          <p className="text-white/80 mt-4 text-lg max-w-2xl mx-auto">
            Vous voyagez entre Bordeaux et l&apos;Algérie ? Proposez de transporter médicaments, documents ou petits colis pour aider la communauté.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4">

          {/* Info */}
          <div className="bg-vert-50 border border-vert-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <Info className="w-5 h-5 text-vert flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              Chaque annonce est <strong>vérifiée et validée par l&apos;équipe AEAB</strong> avant publication.
              Le contact entre membres se fait directement par email ou téléphone.
              Rappel : le transport de marchandises est soumis aux règles douanières.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-heading font-bold text-xl text-gray-900">
                {filtered.length} trajet(s) disponible(s)
              </h2>
              <p className="text-sm text-gray-500">Bordeaux → Algérie</p>
            </div>
            <button onClick={() => setShowForm(true)}
              className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Proposer un transport
            </button>
          </div>

          {/* Filtre ville */}
          <div className="mb-5">
            <select className="form-input max-w-xs" value={filterVille} onChange={e => setFilterVille(e.target.value)}>
              <option value="">Toutes les destinations</option>
              {VILLES_ALGERIE.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>

          {/* Modal formulaire */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
              <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-heading font-bold text-xl">Proposer un transport</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Votre annonce sera vérifiée avant publication</p>
                  </div>
                  <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Identité */}
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="form-label">Prénom *</label><input required className="form-input" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} /></div>
                    <div><label className="form-label">Nom *</label><input required className="form-input" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="form-label">Email *</label><input required type="email" className="form-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                    <div><label className="form-label">Téléphone *</label><input required className="form-input" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} /></div>
                  </div>

                  {/* Trajet */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">Départ *</label>
                      <input className="form-input" value={form.depart} onChange={e => setForm({ ...form, depart: e.target.value })} placeholder="Ex: Bordeaux" />
                    </div>
                    <div>
                      <label className="form-label">Arrivée (ville) *</label>
                      <select required className="form-input" value={form.arrivee} onChange={e => setForm({ ...form, arrivee: e.target.value })}>
                        <option value="">Sélectionner</option>
                        {VILLES_ALGERIE.map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="form-label">Date de départ *</label><input required type="date" className="form-input" value={form.date_voyage} onChange={e => setForm({ ...form, date_voyage: e.target.value })} /></div>
                    <div>
                      <label className="flex items-center gap-2 form-label cursor-pointer">
                        <input type="checkbox" checked={form.aller_retour} onChange={e => setForm({ ...form, aller_retour: e.target.checked })} className="accent-vert w-4 h-4" />
                        Aller-retour ?
                      </label>
                      {form.aller_retour && <input type="date" className="form-input mt-1" placeholder="Date de retour" value={form.date_retour} onChange={e => setForm({ ...form, date_retour: e.target.value })} />}
                    </div>
                  </div>

                  {/* Types acceptés */}
                  <div>
                    <label className="form-label">Objets acceptés * <span className="text-gray-400 font-normal">(sélectionnez tout ce que vous acceptez)</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {TYPES.map(t => (
                        <button key={t.value} type="button" onClick={() => toggleType(t.value)}
                          className={`text-left p-3 rounded-xl border-2 transition-all ${form.types_acceptes.includes(t.value) ? 'border-vert bg-vert-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className="font-semibold text-sm">{t.label}</div>
                          <div className="text-xs text-gray-500">{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Poids max */}
                  <div className="max-w-xs">
                    <label className="form-label">Poids max accepté (kg)</label>
                    <input type="number" min="0" step="0.5" className="form-input" placeholder="Ex: 2.5" value={form.poids_max} onChange={e => setForm({ ...form, poids_max: e.target.value })} />
                  </div>

                  <div>
                    <label className="form-label">Commentaire</label>
                    <textarea rows={3} className="form-input" placeholder="Précisions, conditions, zone de récupération..." value={form.commentaire} onChange={e => setForm({ ...form, commentaire: e.target.value })} />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-700">
                    ⚠️ En soumettant cette annonce, vous confirmez que les objets transportés respectent les règles douanières franco-algériennes.
                  </div>

                  <button type="submit" disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi...</> : <><Plane className="w-4 h-4" /> Soumettre mon annonce</>}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Modal détail */}
          {sel && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSel(null)}>
              <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-lg">{sel.prenom} {sel.nom}</h3>
                  <button onClick={() => setSel(null)}><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 font-bold text-lg text-gray-900 mb-2">
                      <MapPin className="w-4 h-4 text-rouge" /> {sel.depart}
                      <span className="text-gray-400">→</span>
                      <MapPin className="w-4 h-4 text-vert" /> {sel.arrivee}
                    </div>
                    <p className="text-gray-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(sel.date_voyage).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      {sel.aller_retour && sel.date_retour && ` → retour le ${new Date(sel.date_retour).toLocaleDateString('fr-FR')}`}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Accepte :</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(sel.types_acceptes || []).map((t: string) => (
                        <span key={t} className="text-xs bg-vert-50 text-vert px-2 py-1 rounded-full">{getTypeLabel(t)}</span>
                      ))}
                    </div>
                  </div>
                  {sel.poids_max && <p className="text-gray-600"><Package className="w-3.5 h-3.5 inline mr-1" /> Poids max : <strong>{sel.poids_max} kg</strong></p>}
                  {sel.commentaire && <p className="text-gray-600 italic bg-gray-50 p-3 rounded-lg">&ldquo;{sel.commentaire}&rdquo;</p>}
                  <div className="border-t pt-3 space-y-2">
                    <p className="font-semibold text-gray-700">Contacter :</p>
                    <a href={`tel:${sel.telephone}`} className="flex items-center gap-2 text-vert hover:underline">
                      <Phone className="w-4 h-4" /> {sel.telephone}
                    </a>
                    <a href={`mailto:${sel.email}`} className="flex items-center gap-2 text-vert hover:underline">
                      <Mail className="w-4 h-4" /> {sel.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Annonces */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map(a => (
                <div key={a.id} onClick={() => setSel(a)}
                  className="card cursor-pointer hover:-translate-y-1 transition-transform p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 font-heading font-bold text-lg text-gray-900">
                      <MapPin className="w-4 h-4 text-rouge flex-shrink-0" />
                      {a.depart}
                      <span className="text-gray-400">→</span>
                      <MapPin className="w-4 h-4 text-vert flex-shrink-0" />
                      {a.arrivee}
                    </div>
                    {a.aller_retour && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full flex-shrink-0">↔ A/R</span>}
                  </div>

                  <div className="text-sm text-gray-500 mb-3 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(a.date_voyage).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(a.types_acceptes || []).map((t: string) => (
                      <span key={t} className="text-xs bg-vert-50 text-vert px-2 py-1 rounded-full font-medium">
                        {getTypeLabel(t)}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-vert-100 flex items-center justify-center text-vert text-sm font-bold">
                        {a.prenom?.[0]}{a.nom?.[0]}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{a.prenom} {a.nom}</span>
                    </div>
                    {a.poids_max && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Package className="w-3 h-3" /> max {a.poids_max}kg
                      </span>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-vert font-semibold">
                    Cliquez pour voir les coordonnées →
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <Plane className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Aucun trajet disponible pour le moment.</p>
              <p className="text-sm mt-2">Soyez le premier à proposer un transport !</p>
              <button onClick={() => setShowForm(true)} className="btn-primary mt-5">
                ✈️ Proposer un transport
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
