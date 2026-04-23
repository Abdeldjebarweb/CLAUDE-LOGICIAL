'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Eye, X, Mail, Phone, FileText, ExternalLink } from 'lucide-react'

const sC: Record<string, string> = {
  new: 'bg-rouge-50 text-rouge',
  in_progress: 'bg-yellow-50 text-yellow-700',
  resolved: 'bg-vert-50 text-vert',
  closed: 'bg-gray-100 text-gray-500',
}
const sL: Record<string, string> = {
  new: '🆕 Nouvelle',
  in_progress: '⏳ En cours',
  resolved: '✅ Résolue',
  closed: '⚪ Fermée',
}
const urgenceC: Record<string, string> = {
  low: 'bg-gray-100 text-gray-500',
  medium: 'bg-yellow-50 text-yellow-700',
  high: 'bg-orange-50 text-orange-700',
  critical: 'bg-rouge-100 text-rouge font-bold',
}
const urgenceL: Record<string, string> = {
  low: 'Faible', medium: 'Moyenne', high: 'Élevée', critical: '🚨 URGENTE',
}

export default function AdminDemandes() {
  const [items, setItems] = useState<any[]>([])
  const [sel, setSel] = useState<any>(null)
  const [filter, setFilter] = useState('all')

  const load = async () => {
    const { data } = await supabase
      .from('help_requests')
      .select('*')
      .order('created_at', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => {
    load()
    const interval = setInterval(load, 30000) // Rafraîchir toutes les 30s
    return () => clearInterval(interval)
  }, [])

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter)

  const upd = async (id: string, status: string) => {
    await supabase.from('help_requests').update({ status }).eq('id', id)
    if (sel?.id === id) setSel((p: any) => ({ ...p, status }))
    load()
  }

  const counts = {
    all: items.length,
    new: items.filter(i => i.status === 'new').length,
    in_progress: items.filter(i => i.status === 'in_progress').length,
    resolved: items.filter(i => i.status === 'resolved').length,
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold">Demandes d&apos;aide ({items.length})</h2>
          {counts.new > 0 && <p className="text-sm text-rouge font-semibold">⚠️ {counts.new} nouvelle(s) demande(s)</p>}
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { key: 'all', label: 'Toutes', count: counts.all },
          { key: 'new', label: '🆕 Nouvelles', count: counts.new },
          { key: 'in_progress', label: '⏳ En cours', count: counts.in_progress },
          { key: 'resolved', label: '✅ Résolues', count: counts.resolved },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold ${filter === f.key ? 'bg-vert text-white' : 'bg-gray-100 text-gray-600'}`}>
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Modal détail */}
      {sel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSel(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-lg">{sel.first_name} {sel.last_name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${urgenceC[sel.urgency]}`}>{urgenceL[sel.urgency]}</span>
              </div>
              <button onClick={() => setSel(null)}><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 text-sm">
              {/* Contact */}
              <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                <a href={`mailto:${sel.email}`} className="flex items-center gap-2 text-vert hover:underline">
                  <Mail className="w-4 h-4" /> {sel.email}
                </a>
                {sel.phone && (
                  <a href={`tel:${sel.phone}`} className="flex items-center gap-2 text-vert hover:underline">
                    <Phone className="w-4 h-4" /> {sel.phone}
                  </a>
                )}
              </div>

              {/* Infos */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Type d'aide", value: sel.help_type },
                  { label: 'Urgence', value: urgenceL[sel.urgency] },
                  { label: 'Établissement', value: sel.institution },
                  { label: 'Filière', value: sel.field },
                  { label: 'Âge', value: sel.age },
                  { label: 'Situation', value: sel.situation },
                ].filter(i => i.value).map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="font-medium text-xs">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="bg-vert-50 border border-vert-200 rounded-lg p-3">
                <p className="font-semibold text-vert mb-1 text-xs">Description :</p>
                <p className="whitespace-pre-wrap">{sel.description}</p>
              </div>

              {/* Documents */}
              {(sel.passport_url || sel.inscription_url) && (
                <div className="space-y-2">
                  <p className="font-semibold text-xs">📎 Documents joints :</p>
                  {sel.passport_url && (
                    <a href={sel.passport_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-vert hover:underline text-xs bg-vert-50 p-2 rounded-lg">
                      <FileText className="w-4 h-4" /> Carte d&apos;identité
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  )}
                  {sel.inscription_url && (
                    <a href={sel.inscription_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-vert hover:underline text-xs bg-vert-50 p-2 rounded-lg">
                      <FileText className="w-4 h-4" /> Attestation d&apos;inscription
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  )}
                </div>
              )}

              <p className="text-xs text-gray-400">
                Soumis le {new Date(sel.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>

              {/* Changer statut */}
              <div>
                <p className="font-semibold text-xs mb-2">Changer le statut :</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(sL).map(([k, v]) => (
                    <button key={k} onClick={() => upd(sel.id, k)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${sel.status === k ? 'bg-vert text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tableau */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Nom</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Type</th>
              <th className="px-4 py-3 text-left font-semibold">Urgence</th>
              <th className="px-4 py-3 text-left font-semibold">Statut</th>
              <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Date</th>
              <th className="px-4 py-3 text-right font-semibold">Docs</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(r => (
              <tr key={r.id} className={`hover:bg-gray-50 cursor-pointer ${r.status === 'new' ? 'bg-rouge-50/10' : ''}`}
                onClick={() => setSel(r)}>
                <td className="px-4 py-3 font-medium">{r.first_name} {r.last_name}</td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell text-xs">{r.help_type}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${urgenceC[r.urgency] || ''}`}>
                    {urgenceL[r.urgency] || r.urgency}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${sC[r.status] || ''}`}>
                    {sL[r.status] || r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                  {new Date(r.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-3 text-right">
                  {(r.passport_url || r.inscription_url) && (
                    <span className="text-xs bg-vert-50 text-vert px-2 py-0.5 rounded-full">📎 {[r.passport_url, r.inscription_url].filter(Boolean).length}</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Aucune demande</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
