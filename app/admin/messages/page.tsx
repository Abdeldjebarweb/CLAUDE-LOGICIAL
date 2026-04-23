'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, MailOpen, Trash2, X, Reply } from 'lucide-react'

export default function AdminMessages() {
  const [items, setItems] = useState<any[]>([])
  const [sel, setSel] = useState<any>(null)
  const [filter, setFilter] = useState('all')

  const load = async () => {
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  const open = async (m: any) => {
    setSel(m)
    // Marquer comme lu (colonne statut ou is_read selon ce qui existe)
    if (m.statut === 'nouveau' || !m.is_read) {
      await supabase.from('contacts').update({ statut: 'lu', is_read: true }).eq('id', m.id)
      load()
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer ce message ?')) return
    await supabase.from('contacts').delete().eq('id', id)
    load()
    setSel(null)
  }

  const filtered = filter === 'all' ? items
    : filter === 'nouveau' ? items.filter(m => m.statut === 'nouveau' || !m.is_read)
    : items.filter(m => m.statut === filter)

  const nonLus = items.filter(m => m.statut === 'nouveau' || !m.is_read).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold">Messages ({items.length})</h2>
          {nonLus > 0 && <p className="text-sm text-vert font-semibold">{nonLus} non lu(s)</p>}
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Tous' },
            { key: 'nouveau', label: '📬 Non lus' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold ${filter === f.key ? 'bg-vert text-white' : 'bg-gray-100 text-gray-600'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Modal message */}
      {sel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSel(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-lg">{sel.sujet || sel.subject || 'Sans sujet'}</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  De : <strong>{sel.nom || sel.name}</strong> — {sel.email}
                </p>
                <p className="text-xs text-gray-400">{new Date(sel.created_at).toLocaleString('fr-FR')}</p>
              </div>
              <button onClick={() => setSel(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 whitespace-pre-wrap mb-4">
              {sel.message}
            </div>
            <div className="flex items-center justify-between">
              <a href={`mailto:${sel.email}?subject=Re: ${sel.sujet || sel.subject || ''}`}
                className="flex items-center gap-2 text-sm text-vert font-semibold hover:underline">
                <Reply className="w-4 h-4" /> Répondre par email
              </a>
              <button onClick={() => remove(sel.id)} className="text-rouge text-sm flex items-center gap-1 hover:underline">
                <Trash2 className="w-4 h-4" /> Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste messages */}
      <div className="space-y-2">
        {filtered.map(m => {
          const nonLu = m.statut === 'nouveau' || !m.is_read
          return (
            <div key={m.id} onClick={() => open(m)}
              className={`bg-white rounded-xl border p-4 cursor-pointer hover:shadow-sm transition-shadow flex items-start gap-3 ${nonLu ? 'border-vert-200 bg-vert-50/20' : ''}`}>
              {nonLu
                ? <Mail className="w-5 h-5 text-vert mt-0.5 flex-shrink-0" />
                : <MailOpen className="w-5 h-5 text-gray-300 mt-0.5 flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-sm truncate ${nonLu ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                    {m.nom || m.name || m.email}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(m.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <p className={`text-sm truncate ${nonLu ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                  {m.sujet || m.subject || 'Sans sujet'}
                </p>
                <p className="text-xs text-gray-400 truncate">{m.message}</p>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Mail className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>Aucun message</p>
          </div>
        )}
      </div>
    </div>
  )
}
