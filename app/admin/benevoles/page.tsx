'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Heart, Eye, X, Mail, Phone, CheckCircle, XCircle, Trash2, CheckSquare, Square } from 'lucide-react'

const sC: Record<string, string> = {
  nouveau: 'bg-blue-50 text-blue-700',
  contacte: 'bg-yellow-50 text-yellow-700',
  actif: 'bg-vert-50 text-vert',
  inactif: 'bg-gray-100 text-gray-500',
  refuse: 'bg-rouge-50 text-rouge',
}
const sL: Record<string, string> = {
  nouveau: '🆕 Nouveau',
  contacte: '📞 Contacté',
  actif: '✅ Accepté',
  inactif: '⚪ Inactif',
  refuse: '❌ Refusé',
}

export default function AdminBenevoles() {
  const [items, setItems] = useState<any[]>([])
  const [sel, setSel] = useState<any>(null)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<string[]>([])

  const load = async () => {
    const { data } = await supabase.from('benevoles').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => {
    load()
    const interval = setInterval(load, 30000) // Rafraîchir toutes les 30s
    return () => clearInterval(interval)
  }, [])

  const filtered = filter === 'all' ? items : items.filter(i => i.statut === filter)

  const updateStatut = async (id: string, statut: string) => {
    await supabase.from('benevoles').update({ statut }).eq('id', id)
    if (sel?.id === id) setSel((prev: any) => ({ ...prev, statut }))
    load()
  }

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const selectAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map(i => i.id))

  const deleteSelected = async () => {
    if (!confirm(`Supprimer ${selected.length} candidature(s) ?`)) return
    await Promise.all(selected.map(id => supabase.from('benevoles').delete().eq('id', id)))
    setSelected([])
    load()
  }

  const counts = {
    all: items.length,
    nouveau: items.filter(i => i.statut === 'nouveau').length,
    actif: items.filter(i => i.statut === 'actif').length,
    refuse: items.filter(i => i.statut === 'refuse').length,
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold">Candidatures bénévoles ({items.length})</h2>
          {counts.nouveau > 0 && (
            <p className="text-sm text-yellow-600 font-semibold mt-0.5">
              ⚠️ {counts.nouveau} candidature(s) en attente de réponse
            </p>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { key: 'all', label: 'Toutes', count: counts.all },
          { key: 'nouveau', label: '🆕 Nouvelles', count: counts.nouveau },
          { key: 'actif', label: '✅ Acceptées', count: counts.actif },
          { key: 'refuse', label: '❌ Refusées', count: counts.refuse },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${filter === f.key ? 'bg-vert text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Modal détail */}
      {sel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSel(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">{sel.prenom} {sel.nom}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${sC[sel.statut]}`}>{sL[sel.statut]}</span>
                <button onClick={() => setSel(null)}><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <a href={`mailto:${sel.email}`} className="flex items-center gap-2 text-vert hover:underline">
                  <Mail className="w-4 h-4" /> {sel.email}
                </a>
                {sel.telephone && (
                  <a href={`tel:${sel.telephone}`} className="flex items-center gap-2 text-vert hover:underline">
                    <Phone className="w-4 h-4" /> {sel.telephone}
                  </a>
                )}
              </div>

              {sel.domaines && sel.domaines.length > 0 && (
                <div>
                  <p className="font-semibold mb-2">Domaines souhaités :</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sel.domaines.map((d: string) => (
                      <span key={d} className="text-xs bg-vert-50 text-vert px-2 py-1 rounded-full">{d}</span>
                    ))}
                  </div>
                </div>
              )}

              {sel.disponibilites && <p><b>Disponibilités :</b> {sel.disponibilites}</p>}

              {sel.experience && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold mb-1">Expérience :</p>
                  <p>{sel.experience}</p>
                </div>
              )}

              {sel.motivation && (
                <div className="bg-vert-50 p-3 rounded-lg border border-vert-200">
                  <p className="font-semibold mb-1 text-vert">Motivation :</p>
                  <p>{sel.motivation}</p>
                </div>
              )}

              <p className="text-xs text-gray-400">
                Candidature du {new Date(sel.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Actions */}
            {sel.statut === 'nouveau' && (
              <div className="flex gap-3 mt-6">
                <button onClick={() => updateStatut(sel.id, 'refuse')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rouge-50 text-rouge font-semibold hover:bg-rouge-100 border border-rouge-200 transition-colors">
                  <XCircle className="w-5 h-5" /> Refuser
                </button>
                <button onClick={() => updateStatut(sel.id, 'actif')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-vert text-white font-semibold hover:bg-vert-700 transition-colors">
                  <CheckCircle className="w-5 h-5" /> Accepter
                </button>
              </div>
            )}
            {sel.statut === 'actif' && (
              <div className="mt-4 flex gap-3">
                <div className="flex-1 bg-vert-50 border border-vert-200 rounded-lg p-3 text-sm text-vert flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Bénévole accepté
                </div>
                <button onClick={() => updateStatut(sel.id, 'inactif')}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200">
                  Désactiver
                </button>
              </div>
            )}
            {sel.statut === 'refuse' && (
              <div className="mt-4 bg-rouge-50 border border-rouge-200 rounded-lg p-3 text-sm text-rouge flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Candidature refusée
              </div>
            )}
          </div>
        </div>
      )}

      {selected.length > 0 && (
        <div className="flex items-center gap-3 bg-rouge-50 border border-rouge-200 rounded-xl p-3 mb-3">
          <span className="text-sm font-semibold text-rouge">{selected.length} sélectionné(s)</span>
          <button onClick={deleteSelected} className="flex items-center gap-1.5 text-xs bg-rouge text-white px-3 py-1.5 rounded-lg font-semibold">
            <Trash2 className="w-3.5 h-3.5" /> Supprimer
          </button>
          <button onClick={() => setSelected([])} className="text-xs text-gray-500 hover:underline ml-auto">Annuler</button>
        </div>
      )}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 w-8">
                <button onClick={selectAll} className="text-gray-400 hover:text-vert">
                  {selected.length === filtered.length && filtered.length > 0 ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                </button>
              </th>
              <th className="px-4 py-3 text-left font-semibold">Nom</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Email</th>
              <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Domaines</th>
              <th className="px-4 py-3 text-left font-semibold">Statut</th>
              <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Date</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(b => (
              <tr key={b.id} className={`hover:bg-gray-50 ${b.statut === 'nouveau' ? 'bg-blue-50/30' : ''}`}>
                <td className="px-4 py-3">
                  <button onClick={() => toggleSelect(b.id)} className="text-gray-400 hover:text-vert">
                    {selected.includes(b.id) ? <CheckSquare className="w-4 h-4 text-vert" /> : <Square className="w-4 h-4" />}
                  </button>
                </td>
                <td className="px-4 py-3 font-medium">{b.prenom} {b.nom}</td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{b.email}</td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {(b.domaines || []).slice(0, 2).map((d: string) => (
                      <span key={d} className="text-xs bg-vert-50 text-vert px-1.5 py-0.5 rounded">
                        {d.split(' ').slice(0, 2).join(' ')}
                      </span>
                    ))}
                    {(b.domaines || []).length > 2 && <span className="text-xs text-gray-400">+{b.domaines.length - 2}</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${sC[b.statut] || ''}`}>{sL[b.statut] || b.statut}</span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                  {new Date(b.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-1 justify-end">
                    {b.statut === 'nouveau' && (
                      <>
                        <button onClick={() => updateStatut(b.id, 'refuse')} className="p-1.5 rounded-lg text-rouge hover:bg-rouge-50" title="Refuser">
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => updateStatut(b.id, 'actif')} className="p-1.5 rounded-lg text-vert hover:bg-vert-50" title="Accepter">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button onClick={() => setSel(b)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100" title="Voir détails">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                <Heart className="w-8 h-8 mx-auto mb-2 opacity-30" />
                Aucune candidature bénévole
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
