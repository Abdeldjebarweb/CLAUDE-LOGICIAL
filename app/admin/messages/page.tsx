'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, MailOpen, Trash2, X } from 'lucide-react'

export default function AdminMessages() {
  const [items, setItems] = useState<any[]>([])
  const [sel, setSel] = useState<any>(null)
  const load = async () => { const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false }); setItems(data || []) }
  useEffect(() => { load() }, [])

  const open = async (m: any) => {
    setSel(m)
    if (!m.is_read) { await supabase.from('contacts').update({ is_read: true }).eq('id', m.id); load() }
  }
  const remove = async (id: string) => { if (confirm('Supprimer ?')) { await supabase.from('contacts').delete().eq('id', id); load(); setSel(null) } }

  return (
    <div>
      <h2 className="text-lg font-bold mb-6">Messages ({items.length})</h2>
      {sel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSel(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <h3 className="font-heading font-bold">{sel.subject}</h3>
              <button onClick={() => setSel(null)}><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-1"><b>{sel.name}</b> — {sel.email}</p>
            <p className="text-xs text-gray-400 mb-4">{new Date(sel.created_at).toLocaleString('fr-FR')}</p>
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">{sel.message}</div>
            <div className="flex justify-end mt-4">
              <button onClick={() => remove(sel.id)} className="text-rouge text-sm flex items-center gap-1 hover:underline"><Trash2 className="w-4 h-4" /> Supprimer</button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {items.map(m => (
          <div key={m.id} onClick={() => open(m)} className={`bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-shadow flex items-start gap-3 ${!m.is_read ? 'border-vert-200 bg-vert-50/30' : ''}`}>
            {m.is_read ? <MailOpen className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" /> : <Mail className="w-5 h-5 text-vert mt-0.5 shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${!m.is_read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{m.name}</span>
                <span className="text-xs text-gray-400">{new Date(m.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
              <p className="text-sm font-semibold text-gray-800 truncate">{m.subject}</p>
              <p className="text-xs text-gray-500 truncate">{m.message}</p>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center py-12 text-gray-400">Aucun message</p>}
      </div>
    </div>
  )
}
