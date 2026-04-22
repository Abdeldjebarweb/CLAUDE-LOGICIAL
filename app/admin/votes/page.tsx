'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, X, Vote, BarChart2 } from 'lucide-react'

export default function AdminVotes() {
  const [votes, setVotes] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [sel, setSel] = useState<any>(null)
  const [form, setForm] = useState({
    titre: '', description: '', options: ['', ''],
    date_fin: '', resultats_publics: false
  })

  const load = async () => {
    const { data } = await supabase
      .from('votes')
      .select('id, titre, description, options, actif, resultats_publics, date_fin, created_at')
      .order('created_at', { ascending: false })
    // Load responses separately
    const votesWithCounts = await Promise.all((data || []).map(async v => {
      const { count } = await supabase
        .from('vote_reponses')
        .select('*', { count: 'exact', head: true })
        .eq('vote_id', v.id)
      return { ...v, nb_reponses: count || 0 }
    }))
    setVotes(votesWithCounts)
  }

  const loadResultats = async (vote: any) => {
    const { data } = await supabase
      .from('vote_reponses')
      .select('choix')
      .eq('vote_id', vote.id)
    setSel({ ...vote, reponses: data || [] })
  }

  useEffect(() => { load() }, [])

  const addOption = () => setForm({ ...form, options: [...form.options, ''] })
  const removeOption = (i: number) => setForm({ ...form, options: form.options.filter((_, idx) => idx !== i) })
  const setOption = (i: number, v: string) => {
    const opts = [...form.options]; opts[i] = v
    setForm({ ...form, options: opts })
  }

  const handleCreate = async () => {
    const validOptions = form.options.filter(o => o.trim())
    if (!form.titre || validOptions.length < 2) {
      alert('Titre et au moins 2 options requis')
      return
    }
    await supabase.from('votes').insert([{
      titre: form.titre,
      description: form.description,
      options: validOptions,
      date_fin: form.date_fin || null,
      resultats_publics: form.resultats_publics,
      actif: true,
    }])
    setShowForm(false)
    setForm({ titre: '', description: '', options: ['', ''], date_fin: '', resultats_publics: false })
    load()
  }

  const toggleActif = async (id: string, actif: boolean) => {
    await supabase.from('votes').update({ actif: !actif }).eq('id', id)
    load()
  }

  const deleteVote = async (id: string) => {
    if (!confirm('Supprimer ce sondage et toutes ses réponses ?')) return
    await supabase.from('vote_reponses').delete().eq('vote_id', id)
    await supabase.from('votes').delete().eq('id', id)
    load()
  }

  const getResultats = (vote: any) => {
    const reponses = vote.reponses || []
    const total = reponses.length
    return (vote.options || []).map((opt: string) => ({
      option: opt,
      count: reponses.filter((r: any) => r.choix === opt).length,
      pct: total > 0 ? Math.round((reponses.filter((r: any) => r.choix === opt).length / total) * 100) : 0,
    }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Votes & Sondages ({votes.length})</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouveau sondage
        </button>
      </div>

      {/* Modal création */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">Nouveau sondage</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="form-label">Question *</label>
                <input className="form-input" placeholder="Ex: Quel jour pour la prochaine réunion ?"
                  value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Description (optionnel)</label>
                <textarea rows={2} className="form-input" value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Options de réponse * (minimum 2)</label>
                <div className="space-y-2">
                  {form.options.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <input className="form-input flex-1" placeholder={`Option ${i + 1}`}
                        value={opt} onChange={e => setOption(i, e.target.value)} />
                      {form.options.length > 2 && (
                        <button type="button" onClick={() => removeOption(i)}
                          className="p-2 text-rouge hover:bg-rouge-50 rounded-lg">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addOption} className="text-sm text-vert hover:underline">
                    + Ajouter une option
                  </button>
                </div>
              </div>
              <div>
                <label className="form-label">Date limite (optionnel)</label>
                <input type="datetime-local" className="form-input" value={form.date_fin}
                  onChange={e => setForm({ ...form, date_fin: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.resultats_publics}
                  onChange={e => setForm({ ...form, resultats_publics: e.target.checked })}
                  className="w-4 h-4 accent-vert" />
                <span className="text-sm text-gray-700">Résultats visibles avant de voter</span>
              </label>
              <button onClick={handleCreate} className="btn-primary w-full">
                Créer le sondage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal résultats */}
      {sel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSel(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold">{sel.titre}</h3>
              <button onClick={() => setSel(null)}><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">{sel.nb_reponses} réponse(s)</p>
            <div className="space-y-3">
              {getResultats(sel).map((r: any) => (
                <div key={r.option}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{r.option}</span>
                    <span className="text-gray-500">{r.count} ({r.pct}%)</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-vert rounded-full transition-all" style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Liste des sondages */}
      {votes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Vote className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Aucun sondage créé.</p>
          <button onClick={() => setShowForm(true)} className="text-sm text-vert mt-2 hover:underline">
            + Créer le premier sondage
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {votes.map(v => (
            <div key={v.id} className="bg-white rounded-xl border p-5 flex items-start gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{v.titre}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${v.actif ? 'bg-vert-50 text-vert' : 'bg-gray-100 text-gray-500'}`}>
                    {v.actif ? '🟢 Actif' : '⚪ Inactif'}
                  </span>
                </div>
                {v.description && <p className="text-sm text-gray-500 mb-1">{v.description}</p>}
                <p className="text-xs text-gray-400">
                  {v.nb_reponses} réponse(s) • {(v.options || []).length} options
                  {v.date_fin && ` • Expire le ${new Date(v.date_fin).toLocaleDateString('fr-FR')}`}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => loadResultats(v)} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200" title="Voir résultats">
                  <BarChart2 className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={() => toggleActif(v.id, v.actif)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${v.actif ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' : 'bg-vert-50 hover:bg-vert-100 text-vert'}`}>
                  {v.actif ? 'Désactiver' : 'Activer'}
                </button>
                <button onClick={() => deleteVote(v.id)} className="p-2 rounded-lg text-rouge hover:bg-rouge-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
