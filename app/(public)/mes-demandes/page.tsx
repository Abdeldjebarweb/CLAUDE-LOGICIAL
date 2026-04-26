'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { MessageSquare, Send, Loader2, X, Clock, CheckCircle, Bell } from 'lucide-react'

export default function MesDemandesPage() {
  const [demandes, setDemandes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sel, setSel] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMsg, setNewMsg] = useState('')
  const [sending, setSending] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)

  const load = async (email: string) => {
    const { data } = await supabase
      .from('help_requests')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
    setDemandes(data || [])
    setUnreadCount((data || []).filter((d: any) => d.nouveau_message).length)
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user?.email) { setLoading(false); return }
      const email = session.user.email
      setUserEmail(email)
      await load(email)
      setLoading(false)
    })
  }, [])

  const openDemande = async (d: any) => {
    setSel(d)
    const { data } = await supabase
      .from('messages_internes')
      .select('*')
      .eq('demande_id', d.id)
      .order('created_at', { ascending: true })
    setMessages(data || [])
    // Marquer messages admin comme lus
    if (d.nouveau_message) {
      await supabase.from('help_requests').update({ nouveau_message: false }).eq('id', d.id)
      await load(userEmail)
    }
  }

  const sendReply = async () => {
    if (!newMsg.trim() || !sel) return
    setSending(true)
    await supabase.from('messages_internes').insert([{
      demande_id: sel.id,
      expediteur: 'membre',
      contenu: newMsg.trim(),
    }])
    setNewMsg('')
    setSending(false)
    const { data } = await supabase
      .from('messages_internes').select('*')
      .eq('demande_id', sel.id).order('created_at', { ascending: true })
    setMessages(data || [])
  }

  const sC: Record<string, string> = {
    new: 'bg-rouge-50 text-rouge',
    in_progress: 'bg-yellow-50 text-yellow-700',
    resolved: 'bg-vert-50 text-vert',
    closed: 'bg-gray-100 text-gray-500',
  }
  const sL: Record<string, string> = {
    new: '🆕 En attente',
    in_progress: '⏳ En cours de traitement',
    resolved: '✅ Résolue',
    closed: '⚪ Fermée',
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-vert border-t-transparent rounded-full" />
    </div>
  )

  if (!userEmail) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Connectez-vous pour voir vos demandes.</p>
        <a href="/membre" className="btn-primary">Se connecter</a>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-2xl font-bold text-gray-900">Mes demandes d&apos;aide</h1>
          {unreadCount > 0 && (
            <div className="flex items-center gap-2 bg-vert-50 border border-vert-200 rounded-xl px-3 py-2">
              <Bell className="w-4 h-4 text-vert" />
              <span className="text-sm text-vert font-semibold">{unreadCount} nouveau(x) message(s)</span>
            </div>
          )}
        </div>

        {/* Modal */}
        {sel && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSel(null)}>
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b">
                <div>
                  <h3 className="font-heading font-bold">{sel.help_type}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${sC[sel.status]}`}>{sL[sel.status]}</span>
                </div>
                <button onClick={() => setSel(null)}><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <p className="font-semibold text-gray-700 mb-1">Votre description :</p>
                  <p className="text-gray-600">{sel.description}</p>
                </div>

                <div className="border rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-vert" />
                    <p className="font-semibold text-sm">Échanges avec l&apos;AEAB</p>
                  </div>
                  <div className="p-3 space-y-3 max-h-60 overflow-y-auto bg-white">
                    {messages.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-6">
                        Pas encore de réponse. L&apos;équipe AEAB vous répondra prochainement.
                      </p>
                    ) : (
                      messages.map(m => (
                        <div key={m.id} className={`flex ${m.expediteur === 'membre' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${m.expediteur === 'membre' ? 'bg-vert text-white' : 'bg-gray-100 text-gray-800'}`}>
                            <p>{m.contenu}</p>
                            <p className={`text-xs mt-1 ${m.expediteur === 'membre' ? 'text-white/60' : 'text-gray-400'}`}>
                              {m.expediteur === 'membre' ? 'Vous' : '🏢 AEAB'} • {new Date(m.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {sel.status !== 'closed' && (
                    <div className="p-3 border-t bg-gray-50 flex gap-2">
                      <textarea rows={2} className="form-input flex-1 text-sm resize-none"
                        placeholder="Ajouter un message..."
                        value={newMsg} onChange={e => setNewMsg(e.target.value)} />
                      <button onClick={sendReply} disabled={!newMsg.trim() || sending}
                        className="btn-primary px-3 flex items-center self-end">
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {demandes.length > 0 ? (
          <div className="space-y-4">
            {demandes.map(d => (
              <div key={d.id} onClick={() => openDemande(d)}
                className={`bg-white rounded-xl border p-5 cursor-pointer hover:-translate-y-0.5 transition-transform ${d.nouveau_message ? 'border-vert ring-2 ring-vert/20' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-semibold text-gray-900">{d.help_type}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${sC[d.status]}`}>{sL[d.status]}</span>
                      {d.nouveau_message && (
                        <span className="text-xs bg-vert text-white px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                          <Bell className="w-3 h-3" /> Nouveau message
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">{d.description}</p>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(d.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <MessageSquare className={`w-5 h-5 flex-shrink-0 ${d.nouveau_message ? 'text-vert' : 'text-gray-300'}`} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Vous n&apos;avez pas encore de demandes.</p>
            <a href="/contact" className="btn-primary mt-4 inline-block">Faire une demande</a>
          </div>
        )}
      </div>
    </div>
  )
}
