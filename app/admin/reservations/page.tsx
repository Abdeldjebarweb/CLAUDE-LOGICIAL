'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, X, Mail, Phone, Trash2, CheckSquare, Square, Calendar } from 'lucide-react'

export default function AdminReservations() {
  const [events, setEvents] = useState<any[]>([])
  const [reservations, setReservations] = useState<any[]>([])
  const [selEvent, setSelEvent] = useState<any>(null)
  const [sel, setSel] = useState<any>(null)
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    supabase.from('events').select('id, title, date').order('date', { ascending: false })
      .then(({ data }) => setEvents(data || []))
  }, [])

  const loadReservations = async (event: any) => {
    setSelEvent(event)
    const { data } = await supabase.from('reservations').select('*')
      .eq('event_id', event.id).order('created_at', { ascending: false })
    setReservations(data || [])
    setSelected([])
  }

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const deleteSelected = async () => {
    if (!confirm(`Supprimer ${selected.length} réservation(s) ?`)) return
    await Promise.all(selected.map(id => supabase.from('reservations').delete().eq('id', id)))
    setSelected([])
    loadReservations(selEvent)
  }

  const totalPlaces = reservations.reduce((s, r) => s + (r.nb_places || 1), 0)

  return (
    <div>
      <h2 className="text-lg font-bold mb-6">Réservations événements</h2>

      {/* Modal détail réservation */}
      {sel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSel(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">{sel.prenom} {sel.nom}</h3>
              <button onClick={() => setSel(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2 text-sm">
              <a href={`mailto:${sel.email}`} className="flex items-center gap-2 text-vert hover:underline">
                <Mail className="w-4 h-4" /> {sel.email}
              </a>
              {sel.telephone && <a href={`tel:${sel.telephone}`} className="flex items-center gap-2 text-vert hover:underline">
                <Phone className="w-4 h-4" /> {sel.telephone}
              </a>}
              <p className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /> {sel.nb_places} place(s)</p>
              {sel.message && <p className="bg-gray-50 p-3 rounded-lg italic text-gray-600">&ldquo;{sel.message}&rdquo;</p>}
              <p className="text-xs text-gray-400">Réservé le {new Date(sel.created_at).toLocaleDateString('fr-FR')}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <a href={`mailto:${sel.email}?subject=Votre réservation - ${selEvent?.title}`}
                className="flex-1 btn-primary text-sm flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" /> Envoyer email
              </a>
              <button onClick={async () => {
                if (!confirm('Supprimer ?')) return
                await supabase.from('reservations').delete().eq('id', sel.id)
                setSel(null)
                loadReservations(selEvent)
              }} className="p-2.5 rounded-xl text-rouge border border-rouge-200 hover:bg-rouge-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste événements */}
        <div className="lg:col-span-1">
          <h3 className="font-semibold text-sm text-gray-500 mb-3">Sélectionnez un événement</h3>
          <div className="space-y-2">
            {events.map(e => (
              <button key={e.id} onClick={() => loadReservations(e)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${selEvent?.id === e.id ? 'border-vert bg-vert-50' : 'bg-white hover:border-vert-300'}`}>
                <p className="font-semibold text-sm truncate">{e.title}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  {new Date(e.date).toLocaleDateString('fr-FR')}
                </p>
              </button>
            ))}
            {events.length === 0 && <p className="text-sm text-gray-400">Aucun événement</p>}
          </div>
        </div>

        {/* Réservations */}
        <div className="lg:col-span-2">
          {selEvent ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{selEvent.title}</h3>
                  <p className="text-sm text-gray-500">{reservations.length} réservation(s) • {totalPlaces} place(s) au total</p>
                </div>
                <a href={`mailto:?bcc=${reservations.map(r => r.email).join(',')}&subject=Information - ${selEvent.title}`}
                  className="text-xs btn-outline flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> Email à tous
                </a>
              </div>

              {selected.length > 0 && (
                <div className="flex items-center gap-3 bg-rouge-50 border border-rouge-200 rounded-xl p-3 mb-3">
                  <span className="text-sm font-semibold text-rouge">{selected.length} sélectionné(s)</span>
                  <button onClick={deleteSelected} className="flex items-center gap-1.5 text-xs bg-rouge text-white px-3 py-1.5 rounded-lg font-semibold">
                    <Trash2 className="w-3.5 h-3.5" /> Supprimer
                  </button>
                  <button onClick={() => setSelected([])} className="text-xs text-gray-500 ml-auto">Annuler</button>
                </div>
              )}

              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 w-8">
                        <button onClick={() => setSelected(selected.length === reservations.length ? [] : reservations.map(r => r.id))}
                          className="text-gray-400 hover:text-vert">
                          {selected.length === reservations.length && reservations.length > 0
                            ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                        </button>
                      </th>
                      <th className="px-3 py-3 text-left font-semibold">Nom</th>
                      <th className="px-3 py-3 text-left font-semibold hidden md:table-cell">Email</th>
                      <th className="px-3 py-3 text-center font-semibold">Places</th>
                      <th className="px-3 py-3 text-left font-semibold hidden sm:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {reservations.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSel(r)}>
                        <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                          <button onClick={() => toggleSelect(r.id)} className="text-gray-400 hover:text-vert">
                            {selected.includes(r.id) ? <CheckSquare className="w-4 h-4 text-vert" /> : <Square className="w-4 h-4" />}
                          </button>
                        </td>
                        <td className="px-3 py-3 font-medium">{r.prenom} {r.nom}</td>
                        <td className="px-3 py-3 text-gray-500 hidden md:table-cell text-xs">{r.email}</td>
                        <td className="px-3 py-3 text-center">
                          <span className="bg-vert-50 text-vert text-xs font-bold px-2 py-0.5 rounded-full">{r.nb_places}</span>
                        </td>
                        <td className="px-3 py-3 text-gray-400 text-xs hidden sm:table-cell">
                          {new Date(r.created_at).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                    {reservations.length === 0 && (
                      <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-400">
                        Aucune réservation pour cet événement
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400 bg-white rounded-xl border">
              <div className="text-center">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Sélectionnez un événement</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
