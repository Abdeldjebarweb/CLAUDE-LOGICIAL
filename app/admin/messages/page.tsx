'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, MailOpen, Trash2, X, Reply, CheckSquare, Square, Send, Loader2 } from 'lucide-react'

export default function AdminMessages() {
  const [items, setItems] = useState<any[]>([])
  const [sel, setSel] = useState<any>(null)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<string[]>([])
  const [replyText, setReplyText] = useState('')
  const [replySending, setReplySending] = useState(false)
  const [replySent, setReplySent] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [])

  const open = async (m: any) => {
    setSel(m)
    setReplyText('')
    setReplySent(false)
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

  const handleReply = async () => {
    if (!replyText.trim() || !sel) return
    setReplySending(true)

    // Enregistrer la réponse dans la table contacts
    await supabase.from('contacts').update({
      reponse: replyText,
      reponse_at: new Date().toISOString(),
      statut: 'repondu'
    }).eq('id', sel.id)

    // Envoyer via Brevo API
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.NEXT_PUBLIC_BREVO_API_KEY || ''
        },
        body: JSON.stringify({
          sender: { name: 'AEAB Bordeaux', email: 'ismail.abdeldjebar.web@gmail.com' },
          to: [{ email: sel.email, name: sel.nom || sel.name || '' }],
          subject: `Re: ${sel.sujet || sel.subject || 'Votre message'}`,
          htmlContent: `
            <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:30px;">
              <div style="text-align:center;margin-bottom:20px;">
                <img src="https://i.ibb.co/LDtrRVPK/Whats-App-Image-2026-04-25-at-18-53-30.jpg" width="50" style="border-radius:10px;" />
                <h3 style="color:#1a5c38;margin:10px 0 0;">AEAB Bordeaux</h3>
              </div>
              <p>Bonjour ${sel.nom || sel.name || ''},</p>
              <div style="background:#f5f5f5;padding:15px;border-radius:8px;margin:15px 0;white-space:pre-wrap;">${replyText}</div>
              <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
              <p style="color:#aaa;font-size:11px;text-align:center;">
                En réponse à votre message du ${new Date(sel.created_at).toLocaleDateString('fr-FR')}<br/>
                AEAB — associationeab@gmail.com — assoeab.fr
              </p>
            </div>
          `
        })
      })

      if (response.ok) {
        setReplySent(true)
        setReplyText('')
        load()
      } else {
        alert('Erreur lors de l\'envoi. Vérifiez la clé API Brevo.')
      }
    } catch (err) {
      alert('Erreur réseau lors de l\'envoi.')
    }

    setReplySending(false)
  }

  const filtered = filter === 'all' ? items
    : filter === 'nouveau' ? items.filter(m => m.statut === 'nouveau' || !m.is_read)
    : items.filter(m => m.statut === filter)

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const selectAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map(i => i.id))

  const deleteSelected = async () => {
    if (!confirm(`Supprimer ${selected.length} message(s) ?`)) return
    await Promise.all(selected.map(id => supabase.from('contacts').delete().eq('id', id)))
    setSelected([])
    load()
  }

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
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
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

            {/* Message original */}
            <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 whitespace-pre-wrap mb-4">
              {sel.message}
            </div>

            {/* Réponse précédente */}
            {sel.reponse && (
              <div className="bg-vert-50 border border-vert-200 p-3 rounded-xl text-sm text-gray-700 mb-4">
                <p className="text-xs text-vert font-semibold mb-1">✅ Réponse envoyée le {new Date(sel.reponse_at).toLocaleDateString('fr-FR')}</p>
                <p className="whitespace-pre-wrap">{sel.reponse}</p>
              </div>
            )}

            {/* Zone de réponse */}
            {replySent ? (
              <div className="bg-vert-50 border border-vert-200 rounded-xl p-4 text-center text-vert font-semibold text-sm">
                ✅ Réponse envoyée avec succès !
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b flex items-center gap-2">
                  <Reply className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500 font-medium">Répondre à {sel.email}</span>
                </div>
                <textarea
                  rows={5}
                  className="w-full p-4 text-sm resize-none focus:outline-none"
                  placeholder="Tapez votre réponse ici..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                />
                <div className="flex items-center justify-between px-4 py-2 border-t bg-gray-50">
                  <button onClick={() => remove(sel.id)} className="text-rouge text-xs flex items-center gap-1 hover:underline">
                    <Trash2 className="w-3.5 h-3.5" /> Supprimer
                  </button>
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim() || replySending}
                    className="flex items-center gap-2 bg-vert text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-vert-700 transition-colors disabled:opacity-50"
                  >
                    {replySending
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi...</>
                      : <><Send className="w-4 h-4" /> Envoyer</>
                    }
                  </button>
                </div>
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

      {filtered.length > 0 && (
        <div className="flex items-center gap-2 mb-2 px-1">
          <button onClick={selectAll} className="text-gray-400 hover:text-vert flex items-center gap-1.5 text-xs">
            {selected.length === filtered.length && filtered.length > 0
              ? <CheckSquare className="w-4 h-4 text-vert" />
              : <Square className="w-4 h-4" />}
            Tout sélectionner
          </button>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map(m => {
          const nonLu = m.statut === 'nouveau' || !m.is_read
          const repondu = m.statut === 'repondu'
          return (
            <div key={m.id}
              className={`bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow flex items-start gap-3 ${nonLu ? 'border-vert-200 bg-vert-50/20' : ''}`}>
              <button onClick={() => toggleSelect(m.id)} className="text-gray-300 hover:text-vert flex-shrink-0 mt-0.5">
                {selected.includes(m.id) ? <CheckSquare className="w-4 h-4 text-vert" /> : <Square className="w-4 h-4" />}
              </button>
              <button onClick={() => open(m)} className="flex-shrink-0 mt-0.5">
                {nonLu ? <Mail className="w-5 h-5 text-vert" /> : <MailOpen className="w-5 h-5 text-gray-300" />}
              </button>
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => open(m)}>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-sm truncate ${nonLu ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                    {m.nom || m.name || m.email}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {repondu && <span className="text-xs bg-vert-50 text-vert px-2 py-0.5 rounded-full">✅ Répondu</span>}
                    <span className="text-xs text-gray-400">{new Date(m.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
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
