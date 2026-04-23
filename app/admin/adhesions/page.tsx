'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Eye, X, CheckCircle, XCircle, Mail, Phone, Search, Trash2, CheckSquare, Square } from 'lucide-react'

const sC: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  approved: 'bg-vert-50 text-vert',
  rejected: 'bg-rouge-50 text-rouge',
}
const sL: Record<string, string> = {
  pending: '⏳ En attente',
  approved: '✅ Acceptée',
  rejected: '❌ Refusée',
}

export default function AdminAdhesions() {
  const [items, setItems] = useState<any[]>([])
  const [sel, setSel] = useState<any>(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string[]>([])

  const load = async () => {
    const { data } = await supabase.from('memberships').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => {
    load()
    const interval = setInterval(load, 30000) // Rafraîchir toutes les 30s
    return () => clearInterval(interval)
  }, [])

  const filtered = items.filter(m => {
    const matchFilter = filter === 'all' || m.status === filter
    const matchSearch = !search || `${m.first_name} ${m.last_name} ${m.email}`.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('memberships').update({ status }).eq('id', id)
    if (sel?.id === id) setSel((prev: any) => ({ ...prev, status }))
    load()
  }

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const selectAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map(i => i.id))

  const deleteSelected = async () => {
    if (!confirm(`Supprimer ${selected.length} adhésion(s) ?`)) return
    await Promise.all(selected.map(id => supabase.from('memberships').delete().eq('id', id)))
    setSelected([])
    load()
  }

  const counts = {
    all: items.length,
    pending: items.filter(i => i.status === 'pending').length,
    approved: items.filter(i => i.status === 'approved').length,
    rejected: items.filter(i => i.status === 'rejected').length,
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold">Adhésions ({items.length})</h2>
          {counts.pending > 0 && <p className="text-sm text-yellow-600 font-semibold">⚠️ {counts.pending} en attente</p>}
        </div>
      </div>

      {/* Filtres + Recherche */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="form-input pl-9 text-sm" placeholder="Rechercher par nom ou email..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Toutes', count: counts.all },
            { key: 'pending', label: '⏳ En attente', count: counts.pending },
            { key: 'approved', label: '✅ Acceptées', count: counts.approved },
            { key: 'rejected', label: '❌ Refusées', count: counts.rejected },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${filter === f.key ? 'bg-vert text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Modal détail */}
      {sel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSel(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">{sel.first_name} {sel.last_name}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${sC[sel.status]}`}>{sL[sel.status]}</span>
                <button onClick={() => setSel(null)}><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <a href={`mailto:${sel.email}`} className="flex items-center gap-2 text-vert hover:underline">
                  <Mail className="w-4 h-4" /> {sel.email}
                </a>
                {sel.phone && (
                  <a href={`tel:${sel.phone}`} className="flex items-center gap-2 text-vert hover:underline">
                    <Phone className="w-4 h-4" /> {sel.phone}
                  </a>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Établissement', value: sel.institution },
                  { label: 'Filière', value: sel.field },
                  { label: 'Niveau', value: sel.level },
                  { label: "Année d'arrivée", value: sel.arrival_year },
                  { label: 'Ville', value: sel.city },
                ].filter(i => i.value).map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                ))}
              </div>

              {sel.message && (
                <div className="bg-vert-50 border border-vert-200 rounded-lg p-3">
                  <p className="font-semibold text-vert mb-1">Message :</p>
                  <p className="text-gray-700">{sel.message}</p>
                </div>
              )}

              <p className="text-xs text-gray-400">
                Demande du {new Date(sel.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Actions */}
            {sel.status === 'pending' && (
              <div className="flex gap-3 mt-6">
                <button onClick={() => updateStatus(sel.id, 'rejected')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rouge-50 text-rouge font-semibold hover:bg-rouge-100 border border-rouge-200 transition-colors">
                  <XCircle className="w-5 h-5" /> Refuser
                </button>
                <button onClick={() => updateStatus(sel.id, 'approved')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-vert text-white font-semibold hover:bg-vert-700 transition-colors">
                  <CheckCircle className="w-5 h-5" /> Accepter
                </button>
              </div>
            )}
            {sel.status === 'approved' && (
              <div className="mt-4 flex gap-3">
                <div className="flex-1 bg-vert-50 border border-vert-200 rounded-lg p-3 text-sm text-vert flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Adhésion acceptée
                </div>
                <button onClick={() => updateStatus(sel.id, 'rejected')}
                  className="px-4 py-2 rounded-lg bg-rouge-50 text-rouge text-sm border border-rouge-200 hover:bg-rouge-100">
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 bg-rouge-50 border border-rouge-200 rounded-xl p-3 mb-3">
          <span className="text-sm font-semibold text-rouge">{selected.length} sélectionné(s)</span>
          <button onClick={deleteSelected} className="flex items-center gap-1.5 text-xs bg-rouge text-white px-3 py-1.5 rounded-lg font-semibold">
            <Trash2 className="w-3.5 h-3.5" /> Supprimer
          </button>
          <button onClick={() => setSelected([])} className="text-xs text-gray-500 hover:underline ml-auto">Annuler</button>
        </div>
      )}
      {/* Tableau */}
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
              <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Établissement</th>
              <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Filière</th>
              <th className="px-4 py-3 text-left font-semibold">Statut</th>
              <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Date</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(m => (
              <tr key={m.id} className={`hover:bg-gray-50 ${m.status === 'pending' ? 'bg-yellow-50/30' : ''}`}>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <button onClick={() => toggleSelect(m.id)} className="text-gray-400 hover:text-vert">
                    {selected.includes(m.id) ? <CheckSquare className="w-4 h-4 text-vert" /> : <Square className="w-4 h-4" />}
                  </button>
                </td>
                <td className="px-4 py-3 font-medium cursor-pointer" onClick={() => setSel(m)}>{m.first_name} {m.last_name}</td>

                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{m.email}</td>
                <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{m.institution}</td>
                <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{m.field}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${sC[m.status] || ''}`}>{sL[m.status] || m.status}</span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                  {new Date(m.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                  <div className="flex gap-1 justify-end">
                    {m.status !== 'approved' && (
                      <button onClick={() => updateStatus(m.id, 'approved')} className="p-1.5 rounded-lg text-vert hover:bg-vert-50" title="Accepter">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {m.status !== 'rejected' && (
                      <button onClick={() => updateStatus(m.id, 'rejected')} className="p-1.5 rounded-lg text-rouge hover:bg-rouge-50" title="Refuser">
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => setSel(m)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100" title="Voir profil">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Aucune adhésion trouvée</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

}
