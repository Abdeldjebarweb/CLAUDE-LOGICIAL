'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, Send, Plus, X, Loader2, CheckCircle, Trash2, Download } from 'lucide-react'

export default function AdminNewsletter() {
  const [tab, setTab] = useState<'abonnes' | 'envoyer'>('abonnes')
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [campagnes, setCampagnes] = useState<any[]>([])
  const [form, setForm] = useState({ sujet: '', contenu: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const loadSubscribers = async () => {
    const { data } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false })
    setSubscribers(data || [])
  }
  const loadCampagnes = async () => {
    const { data } = await supabase.from('newsletter_campagnes').select('*').order('created_at', { ascending: false })
    setCampagnes(data || [])
  }

  useEffect(() => { loadSubscribers(); loadCampagnes() }, [])

  const deleteSubscriber = async (id: string) => {
    if (!confirm('Désinscrire cet abonné ?')) return
    await supabase.from('newsletter_subscribers').delete().eq('id', id)
    loadSubscribers()
  }

  const exportCSV = () => {
    const csv = ['Email,Nom,Date inscription']
      .concat(subscribers.map(s => `${s.email},${s.nom || ''},${new Date(s.created_at).toLocaleDateString('fr-FR')}`))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-abonnes-${Date.now()}.csv`
    a.click()
  }

  const handleSend = async () => {
    if (!form.sujet || !form.contenu) return
    if (!confirm(`Envoyer cette newsletter à ${subscribers.filter(s => s.statut === 'actif').length} abonné(s) ?`)) return
    setSending(true)

    // Enregistrer la campagne
    const { error: _supaErr } = await supabase.from('newsletter_campagnes').insert([{
    if (_supaErr) console.error("Supabase error:", _supaErr.message)
      sujet: form.sujet,
      contenu: form.contenu,
      nb_envoyes: subscribers.filter(s => s.statut === 'actif').length,
      statut: 'envoye',
      envoye_at: new Date().toISOString(),
    }])

    setSending(false)
    setSent(true)
    setForm({ sujet: '', contenu: '' })
    loadCampagnes()
    setTimeout(() => setSent(false), 4000)
  }

  const actifs = subscribers.filter(s => s.statut === 'actif').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold">Newsletter</h2>
          <p className="text-sm text-gray-500">{actifs} abonné(s) actif(s)</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { key: 'abonnes', label: `📋 Abonnés (${actifs})` },
          { key: 'envoyer', label: '✉️ Envoyer une newsletter' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.key ? 'bg-white shadow text-vert' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'abonnes' && (
        <div className="bg-white rounded-xl border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Prénom</th>
                <th className="px-4 py-3 text-left font-semibold">Statut</th>
                <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {subscribers.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{s.email}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{s.nom || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${s.statut === 'actif' ? 'bg-vert-50 text-vert' : 'bg-gray-100 text-gray-500'}`}>
                      {s.statut === 'actif' ? '✅ Actif' : '❌ Désabonné'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                    {new Date(s.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => deleteSubscriber(s.id)} className="p-1.5 rounded-lg text-rouge hover:bg-rouge-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Aucun abonné pour le moment.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'envoyer' && (
        <div className="max-w-2xl space-y-5">
          {sent && (
            <div className="flex items-center gap-3 bg-vert-50 border border-vert-200 rounded-xl p-4 text-vert">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold text-sm">Newsletter enregistrée ! (Configurez Resend ou Mailchimp pour l&apos;envoi réel)</span>
            </div>
          )}

          <div className="bg-white rounded-xl border p-6 space-y-4">
            <div>
              <label className="form-label">Sujet de l&apos;email *</label>
              <input className="form-input" placeholder="Ex: Événements de novembre 2024"
                value={form.sujet} onChange={e => setForm({ ...form, sujet: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Contenu *</label>
              <textarea rows={12} className="form-input font-mono text-sm"
                placeholder="Rédigez votre newsletter ici... Vous pouvez utiliser du HTML ou du texte simple."
                value={form.contenu} onChange={e => setForm({ ...form, contenu: e.target.value })} />
              <p className="text-xs text-gray-400 mt-1">Conseil : utilisez du texte simple ou du HTML basique.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-700 mb-1">📋 Résumé avant envoi :</p>
              <p className="text-sm text-gray-500">Destinataires : <strong>{actifs} abonné(s) actif(s)</strong></p>
              <p className="text-sm text-gray-500">Expéditeur : associationeab@gmail.com</p>
            </div>

            <button onClick={handleSend} disabled={sending || !form.sujet || !form.contenu}
              className="btn-primary w-full flex items-center justify-center gap-2">
              {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi...</> : <><Send className="w-4 h-4" /> Envoyer à {actifs} abonné(s)</>}
            </button>
          </div>

          {/* Historique */}
          {campagnes.length > 0 && (
            <div>
              <h3 className="font-heading font-bold text-base mb-3">Historique des envois</h3>
              <div className="space-y-2">
                {campagnes.map(c => (
                  <div key={c.id} className="bg-white border rounded-xl p-4 flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{c.sujet}</p>
                      <p className="text-xs text-gray-400">{c.nb_envoyes} destinataires • {new Date(c.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <span className="text-xs bg-vert-50 text-vert px-2 py-0.5 rounded-full">✅ Envoyé</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
