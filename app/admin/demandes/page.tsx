'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Eye, X, Mail, Phone, FileText, ExternalLink, Send, MessageSquare, Loader2, Trash2, CheckSquare, Square } from 'lucide-react'

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
  const [selected, setSelected] = useState<string[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [newMsg, setNewMsg] = useState('')
  const [sending, setSending] = useState(false)

  const load = async () => {
    const { data } = await supabase
      .from('help_requests')
      .select('*')
      .order('created_at', { ascending: false })
    setItems(data || [])
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadMessages = async (demandeId: string) => {
    const { data } = await supabase
      .from('messages_internes')
      .select('*')
      .eq('demande_id', demandeId)
      .order('created_at', { ascending: true })
    setMessages(data || [])
    // Marquer comme lu
    await supabase.from('help_requests').update({ nouveau_message: false }).eq('id', demandeId)
  }

  const openDemande = async (r: any) => {
    setSel(r)
    setNewMsg('')
    await loadMessages(r.id)
  }

  const sendMessage = async () => {
    if (!newMsg.trim() || !sel) return
    setSending(true)
    await supabase.from('messages_internes').insert([{
      demande_id: sel.id,
      expediteur: 'admin',
      contenu: newMsg.trim(),
    }])
    await supabase.from('help_requests').update({
      status: 'in_progress',
      nouveau_message: true,
    }).eq('id', sel.id)
    setNewMsg('')
    setSending(false)
    await loadMessages(sel.id)
    load()
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter)

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const selectAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map(i => i.id))

  const deleteSelected = async () => {
    if (!confirm(`Supprimer ${selected.length} demande(s) ?`)) return
    await Promise.all(selected.map(id => supabase.from('help_requests').delete().eq('id', id)))
    setSelected([])
    load()
  }

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
          {counts.new > 0 && <p className="text-sm text-rouge font-semibold">⚠️ {counts.new} nouvelle(s)</p>}
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

      {/* Modal détail + messagerie */}
      {sel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSel(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h3 className="font-heading font-bold text-lg">{sel.first_name} {sel.last_name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${urgenceC[sel.urgency]}`}>{urgenceL[sel.urgency]}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${sC[sel.status]}`}>{sL[sel.status]}</span>
                </div>
              </div>
              <button onClick={() => setSel(null)}><X className="w-5 h-5" /></button>
            </div>

            {/* Contenu scrollable */}
            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              {/* Infos contact */}
              <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-sm">
                <a href={`mailto:${sel.email}`} className="flex items-center gap-2 text-vert hover:underline">
                  <Mail className="w-4 h-4" /> {sel.email}
                </a>
                {sel.phone && <a href={`tel:${sel.phone}`} className="flex items-center gap-2 text-vert hover:underline">
                  <Phone className="w-4 h-4" /> {sel.phone}
                </a>}
              </div>

              {/* Infos demande */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  { label: "Type d'aide", value: sel.help_type },
                  { label: 'Établissement', value: sel.institution },
                  { label: 'Filière', value: sel.field },
                  { label: 'Situation', value: sel.situation },
                ].filter(i => i.value).map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="font-medium text-xs">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="bg-vert-50 border border-vert-200 rounded-lg p-3 text-sm">
                <p className="font-semibold text-vert mb-1 text-xs">Description :</p>
                <p>{sel.description}</p>
              </div>

              {/* Documents */}
              {(sel.passport_url || sel.inscription_url) && (
                <div className="space-y-2">
                  <p className="font-semibold text-xs text-gray-700">📎 Documents :</p>
                  {sel.passport_url && (
                    <a href={sel.passport_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-vert text-xs bg-vert-50 p-2 rounded-lg hover:underline">
                      <FileText className="w-4 h-4" /> Carte d&apos;identité <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  )}
                  {sel.inscription_url && (
                    <a href={sel.inscription_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-vert text-xs bg-vert-50 p-2 rounded-lg hover:underline">
                      <FileText className="w-4 h-4" /> Attestation d&apos;inscription <ExternalLink className="w-3 h-3 ml-auto" />
                    </a>
                  )}
                </div>
              )}

              {/* Messagerie */}
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-vert" />
                  <p className="font-semibold text-sm">Messages avec le demandeur</p>
                </div>
                <div className="p-3 space-y-3 max-h-48 overflow-y-auto bg-white">
                  {messages.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">Aucun message encore. Répondez au demandeur ci-dessous.</p>
                  ) : (
                    messages.map(m => (
                      <div key={m.id} className={`flex ${m.expediteur === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${m.expediteur === 'admin' ? 'bg-vert text-white' : 'bg-gray-100 text-gray-800'}`}>
                          <p>{m.contenu}</p>
                          <p className={`text-xs mt-1 ${m.expediteur === 'admin' ? 'text-white/60' : 'text-gray-400'}`}>
                            {m.expediteur === 'admin' ? 'Vous' : 'Demandeur'} • {new Date(m.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 border-t bg-gray-50 flex gap-2">
                  <textarea rows={2} className="form-input flex-1 text-sm resize-none"
                    placeholder="Répondre au demandeur..."
                    value={newMsg} onChange={e => setNewMsg(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }} />
                  <button onClick={sendMessage} disabled={!newMsg.trim() || sending}
                    className="btn-primary px-4 flex items-center gap-1 self-end">
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Changer statut */}
              <div className="flex flex-wrap gap-2">
                <p className="text-xs font-semibold text-gray-600 w-full">Statut :</p>
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
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Type</th>
              <th className="px-4 py-3 text-left font-semibold">Urgence</th>
              <th className="px-4 py-3 text-left font-semibold">Statut</th>
              <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Date</th>
              <th className="px-4 py-3 text-right font-semibold">Docs</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(r => (
              <tr key={r.id} className={`hover:bg-gray-50 cursor-pointer ${r.status === 'new' ? 'bg-rouge-50/10' : ''} ${r.nouveau_message ? 'bg-vert-50/20' : ''}`}
                onClick={() => openDemande(r)}>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <button onClick={() => toggleSelect(r.id)} className="text-gray-400 hover:text-vert">
                    {selected.includes(r.id) ? <CheckSquare className="w-4 h-4 text-vert" /> : <Square className="w-4 h-4" />}
                  </button>
                </td>
                <td className="px-4 py-3 font-medium">
                  {r.first_name} {r.last_name}
                  {r.nouveau_message && <span className="ml-2 text-xs bg-vert text-white px-1.5 py-0.5 rounded-full">💬</span>}
                </td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell text-xs">{r.help_type}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${urgenceC[r.urgency] || ''}`}>{urgenceL[r.urgency] || r.urgency}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${sC[r.status] || ''}`}>{sL[r.status] || r.status}</span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
                <td className="px-4 py-3 text-right">
                  {(r.passport_url || r.inscription_url) && (
                    <span className="text-xs bg-vert-50 text-vert px-2 py-0.5 rounded-full">📎</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Aucune demande</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
