'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Calendar, MapPin, Clock, Users, Euro, Loader2, CheckCircle, ExternalLink, ChevronDown, ChevronUp , Lock } from 'lucide-react'

export default function EvenementsPage() {
  // Protection membre
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [forms, setForms] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [filter, setFilter] = useState('upcoming')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session?.user)
      setCheckingAuth(false)
    })
    supabase.from('events').select('*').order('date', { ascending: true })
      .then(({ data }) => { setEvents(data || []); setLoading(false) })
  }, [])

  const filtered = filter === 'all' ? events
    : filter === 'past' ? events.filter(e => new Date(e.date) < new Date() || e.status === 'past')
    : events.filter(e => new Date(e.date) >= new Date() && e.status !== 'past' && e.status !== 'cancelled')

  const getForm = (id: string) => forms[id] || { prenom: '', nom: '', email: '', telephone: '', nb_places: 1, message: '' }
  const setForm = (id: string, field: string, value: any) =>
    setForms(prev => ({ ...prev, [id]: { ...getForm(id), [field]: value } }))

  const handleReservation = async (event: any) => {
    const form = getForm(event.id)
    if (!form.nom || !form.prenom || !form.email) return
    setSubmitting(event.id)
    const { error } = await supabase.from('reservations').insert([{
      event_id: event.id,
      nom: form.nom,
      prenom: form.prenom,
      email: form.email,
      telephone: form.telephone,
      nb_places: form.nb_places,
      message: form.message,
      statut: 'confirmee',
    }])
    setSubmitting(null)
    if (!error) {
      setSuccess(event.id)
      setTimeout(() => setSuccess(null), 5000)
    }
  }

  const isPast = (e: any) => new Date(e.date) < new Date() || e.status === 'past'

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
          <h1 className="font-heading text-4xl font-bold text-white">Événements</h1>
          <p className="text-white/80 mt-4">Découvrez et participez à nos activités</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-4xl mx-auto px-4">
          {/* Filtres */}
          <div className="flex gap-2 mb-8">
            {[
              { key: 'upcoming', label: '📅 À venir' },
              { key: 'past', label: '⚪ Passés' },
              { key: 'all', label: 'Tous' },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`text-sm px-4 py-2 rounded-full font-semibold transition-all ${filter === f.key ? 'bg-vert text-white' : 'bg-white border text-gray-600 hover:border-vert'}`}>
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-vert border-t-transparent rounded-full" /></div>
          ) : filtered.length > 0 ? (
            <div className="space-y-6">
              {filtered.map(event => (
                <div key={event.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${isPast(event) ? 'opacity-75' : ''}`}>
                  
                  {/* Image */}
                  {event.image_url && (
                    <div className="aspect-[21/9] overflow-hidden">
                      <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <h2 className="font-heading font-bold text-xl text-gray-900">{event.title}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          {isPast(event)
                            ? <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">⚪ Terminé</span>
                            : event.status === 'cancelled'
                            ? <span className="text-xs bg-rouge-50 text-rouge px-2 py-0.5 rounded-full">❌ Annulé</span>
                            : <span className="text-xs bg-vert-50 text-vert px-2 py-0.5 rounded-full font-semibold">📅 À venir</span>}
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${event.is_free ? 'bg-vert-50 text-vert' : 'bg-gray-100 text-gray-600'}`}>
                            {event.is_free ? '🎁 Gratuit' : `${event.price}€`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Infos clés */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <Calendar className="w-4 h-4 text-vert mx-auto mb-1" />
                        <p className="text-xs font-semibold text-gray-900">
                          {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      {event.time && (
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <Clock className="w-4 h-4 text-vert mx-auto mb-1" />
                          <p className="text-xs font-semibold text-gray-900">{event.time}</p>
                        </div>
                      )}
                      {event.location && (
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <MapPin className="w-4 h-4 text-rouge mx-auto mb-1" />
                          <p className="text-xs font-semibold text-gray-900 truncate">{event.location}</p>
                        </div>
                      )}
                      {event.capacity && (
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <Users className="w-4 h-4 text-vert mx-auto mb-1" />
                          <p className="text-xs font-semibold text-gray-900">{event.capacity} places</p>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {event.description && (
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{event.description}</p>
                    )}

                    {/* Lien Maps */}
                    {event.maps_link && (
                      <a href={event.maps_link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-vert text-sm hover:underline mb-4">
                        <MapPin className="w-3.5 h-3.5" /> Voir sur Google Maps <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {/* Réservation */}
                    {!isPast(event) && event.status !== 'cancelled' && (
                      <div className="border-t pt-4 mt-2">
                        {success === event.id ? (
                          <div className="bg-vert-50 border border-vert-200 rounded-xl p-4 text-center">
                            <CheckCircle className="w-8 h-8 text-vert mx-auto mb-2" />
                            <h3 className="font-bold text-vert">Réservation confirmée !</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Votre place est réservée. Un email de confirmation vous sera envoyé.
                            </p>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => setExpanded(expanded === event.id ? null : event.id)}
                              className="w-full flex items-center justify-between bg-vert text-white px-5 py-3 rounded-xl font-semibold hover:bg-vert-700 transition-colors">
                              <span>🎟️ Réserver ma place</span>
                              {expanded === event.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>

                            {expanded === event.id && (
                              <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-xl">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="form-label">Prénom *</label>
                                    <input className="form-input text-sm" value={getForm(event.id).prenom}
                                      onChange={e => setForm(event.id, 'prenom', e.target.value)} />
                                  </div>
                                  <div>
                                    <label className="form-label">Nom *</label>
                                    <input className="form-input text-sm" value={getForm(event.id).nom}
                                      onChange={e => setForm(event.id, 'nom', e.target.value)} />
                                  </div>
                                </div>
                                <div>
                                  <label className="form-label">Email * (confirmation envoyée ici)</label>
                                  <input type="email" className="form-input text-sm" value={getForm(event.id).email}
                                    onChange={e => setForm(event.id, 'email', e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="form-label">Téléphone</label>
                                    <input className="form-input text-sm" value={getForm(event.id).telephone}
                                      onChange={e => setForm(event.id, 'telephone', e.target.value)} />
                                  </div>
                                  <div>
                                    <label className="form-label">Nombre de places</label>
                                    <select className="form-input text-sm" value={getForm(event.id).nb_places}
                                      onChange={e => setForm(event.id, 'nb_places', parseInt(e.target.value))}>
                                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} place{n > 1 ? 's' : ''}</option>)}
                                    </select>
                                  </div>
                                </div>
                                <div>
                                  <label className="form-label">Message (optionnel)</label>
                                  <textarea rows={2} className="form-input text-sm" value={getForm(event.id).message}
                                    onChange={e => setForm(event.id, 'message', e.target.value)} />
                                </div>
                                <button onClick={() => handleReservation(event)}
                                  disabled={!getForm(event.id).nom || !getForm(event.id).prenom || !getForm(event.id).email || submitting === event.id}
                                  className="btn-primary w-full flex items-center justify-center gap-2">
                                  {submitting === event.id
                                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi...</>
                                    : '✅ Confirmer ma réservation'}
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Aucun événement pour le moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
