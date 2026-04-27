'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Briefcase, Plus, CheckCircle, XCircle, Trash2, X, Loader2 } from 'lucide-react'

const types = ['Stage', 'CDI', 'CDD', 'Alternance', 'Freelance', 'Bénévolat']
const domaines = ['Informatique', 'Commerce', 'Marketing', 'Médecine', 'Droit', 'Ingénierie', 'Architecture', 'Finance', 'Autre']
const empty = { titre: '', entreprise: '', lieu: 'Bordeaux', type: 'Stage', domaine: '', description: '', remuneration: '', contact: '', duree: '' }

export default function AdminAnnonces() {
  const [annonces, setAnnonces] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ...empty })
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('annonces_emploi').select('*').order('created_at', { ascending: false })
    setAnnonces(data || [])
  }

  useEffect(() => {
    load()
    const i = setInterval(load, 30000)
    return () => clearInterval(i)
  }, [])

  const handleCreate = async () => {
    if (!form.titre) return
    setSaving(true)
    await supabase.from('annonces_emploi').insert([{ ...form, statut: 'publiee' }])
    setSaving(false)
    setShowForm(false)
    setForm({ ...empty })
    load()
  }

  const updateStatut = async (id: string, statut: string) => {
    const { error: _mutErr } = await supabase.from('annonces_emploi').update({ statut }).eq('id', id)
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer cette annonce ?')) return
    await supabase.from('annonces_emploi').delete().eq('id', id)
    load()
  }

  const counts = {
    all: annonces.length,
    publiee: annonces.filter(a => a.statut === 'publiee').length,
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold">Annonces emploi & stage ({counts.all})</h2>
          <p className="text-sm text-vert">{counts.publiee} publiée(s) visible(s) par les membres</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouvelle annonce
        </button>
      </div>

      {/* Modal création */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">Nouvelle annonce</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="form-label">Titre du poste *</label>
                <input className="form-input" placeholder="Ex: Stage développeur web" value={form.titre}
                  onChange={e => setForm(f => ({ ...f, titre: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Entreprise</label>
                  <input className="form-input" value={form.entreprise}
                    onChange={e => setForm(f => ({ ...f, entreprise: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Lieu</label>
                  <input className="form-input" value={form.lieu}
                    onChange={e => setForm(f => ({ ...f, lieu: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Type</label>
                  <select className="form-input" value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    {types.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Domaine</label>
                  <select className="form-input" value={form.domaine}
                    onChange={e => setForm(f => ({ ...f, domaine: e.target.value }))}>
                    <option value="">Sélectionner</option>
                    {domaines.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label">Durée</label>
                  <input className="form-input" placeholder="Ex: 6 mois" value={form.duree}
                    onChange={e => setForm(f => ({ ...f, duree: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">Rémunération</label>
                  <input className="form-input" placeholder="Ex: 600€/mois" value={form.remuneration}
                    onChange={e => setForm(f => ({ ...f, remuneration: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea rows={4} className="form-input" placeholder="Décrivez le poste, les missions, le profil recherché..."
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Lien / Email / Téléphone pour postuler *</label>
                <input className="form-input" placeholder="https://... ou email@exemple.com" value={form.contact}
                  onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
              </div>
              <button onClick={handleCreate} disabled={!form.titre || saving}
                className="btn-primary w-full flex items-center justify-center gap-2">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Publication...</> : '✅ Publier l\'annonce'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tableau */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Poste</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Type</th>
              <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Contact</th>
              <th className="px-4 py-3 text-left font-semibold">Statut</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {annonces.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium">{a.titre}</p>
                  {a.entreprise && <p className="text-xs text-gray-500">{a.entreprise} • {a.lieu}</p>}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a.type}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500 max-w-xs truncate">{a.contact}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    a.statut === 'publiee' ? 'bg-vert-50 text-vert' :
                    a.statut === 'en_attente' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                    {a.statut === 'publiee' ? '✅ Publiée' : a.statut === 'en_attente' ? '⏳ En attente' : '⚪ Expirée'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-1 justify-end">
                    {a.statut !== 'publiee' && (
                      <button onClick={() => updateStatut(a.id, 'publiee')}
                        className="p-1.5 rounded-lg text-vert hover:bg-vert-50" title="Publier">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {a.statut === 'publiee' && (
                      <button onClick={() => updateStatut(a.id, 'expiree')}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100" title="Dépublier">
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => remove(a.id)}
                      className="p-1.5 rounded-lg text-rouge hover:bg-rouge-50" title="Supprimer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {annonces.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-30" />
                Aucune annonce — cliquez &quot;

    if (_mutErr) { console.error("Supabase error:", _mutErr.message) }Nouvelle annonce&quot; pour en créer une
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
