'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plane, Eye, X, CheckCircle, XCircle, Phone, Mail, Package, Calendar, MapPin, EyeOff } from 'lucide-react'

const sC: Record<string, string> = {
  en_attente: 'bg-yellow-50 text-yellow-700',
  valide: 'bg-vert-50 text-vert',
  refuse: 'bg-rouge-50 text-rouge',
  termine: 'bg-gray-100 text-gray-500',
}
const sL: Record<string, string> = {
  en_attente: '⏳ En attente',
  valide: '✅ Validé',
  refuse: '❌ Refusé',
  termine: '⚪ Terminé',
}

const TYPES_LABELS: Record<string, string> = {
  medicaments: '💊 Médicaments',
  papiers: '📄 Documents',
  petits_colis: '📦 Petits colis',
  vetements: '👕 Vêtements',
  autre: '🔹 Autre',
}

export default function AdminTransporteurs() {
  const [items, setItems] = useState<any[]>([])
  const [sel, setSel] = useState<any>(null)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<string[]>([])

  const load = async () => {
    const { data } = await supabase
      .from('transporteurs')
      .select('*')
      .order('created_at', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => {
    load()
    const interval = setInterval(load, 30000) // Rafraîchir toutes les 30s
    return () => clearInterval(interval)
  }, [])

  const filtered = filter === 'all' ? items : items.filter(i => i.statut === filter)

  const updateStatut = async (id: string, statut: string) => {
    const visible = statut === 'valide'
    await supabase.from('transporteurs').update({ statut, visible }).eq('id', id)
    if (sel?.id === id) setSel((prev: any) => ({ ...prev, statut, visible }))
    load()
  }

  // Masquer/afficher les coordonnées du transporteur
  const toggleCoordonnees = async (id: string, masquer: boolean) => {
    await supabase.from('transporteurs').update({ coordonnees_masquees: masquer }).eq('id', id)
    if (sel?.id === id) setSel((prev: any) => ({ ...prev, coordonnees_masquees: masquer }))
    load()
  }

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const selectAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map(i => i.id))

  const deleteSelected = async () => {
    if (!confirm(`Supprimer ${selected.length} annonce(s) ?`)) return
    await Promise.all(selected.map(id => supabase.from('transporteurs').delete().eq('id', id)))
    setSelected([])
    load()
  }

  const deleteSingle = async (id: string) => {
    if (!confirm('Supprimer cette annonce ?')) return
    await supabase.from('transporteurs').delete().eq('id', id)
    load()
  }

  const counts = {
    all: items.length,
    en_attente: items.filter(i => i.statut === 'en_attente').length,
    valide: items.filter(i => i.statut === 'valide').length,
    refuse: items.filter(i => i.statut === 'refuse').length,
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold">Transporteurs solidaires ({items.length})</h2>
          {counts.en_attente > 0 && (
            <p className="text-sm text-yellow-600 font-semibold mt-0.5">
              ⚠️ {counts.en_attente} annonce(s) en attente de validation
            </p>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { key: 'all', label: 'Toutes', count: counts.all },
          { key: 'en_attente', label: '⏳ En attente', count: counts.en_attente },
          { key: 'valide', label: '✅ Validées', count: counts.valide },
          { key: 'refuse', label: '❌ Refusées', count: counts.refuse },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${filter === f.key ? 'bg-vert text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Modal détail */}
      {sel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSel(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">{sel.prenom} {sel.nom}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${sC[sel.statut]}`}>{sL[sel.statut]}</span>
                <button onClick={() => setSel(null)}><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              {/* Coordonnées avec option masquage */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-700">Coordonnées</p>
                  <button
                    onClick={() => toggleCoordonnees(sel.id, !sel.coordonnees_masquees)}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${sel.coordonnees_masquees ? 'bg-rouge-50 text-rouge border border-rouge-200' : 'bg-vert-50 text-vert border border-vert-200'}`}>
                    {sel.coordonnees_masquees ? <><Eye className="w-3 h-3" /> Afficher les contacts</> : <><EyeOff className="w-3 h-3" /> Masquer les contacts</>}
                  </button>
                </div>
                {sel.coordonnees_masquees ? (
                  <p className="text-xs text-rouge bg-rouge-50 p-2 rounded-lg">
                    🔒 Coordonnées masquées — le transporteur ne souhaite pas les afficher publiquement.
                  </p>
                ) : (
                  <>
                    <a href={`mailto:${sel.email}`} className="flex items-center gap-2 text-vert hover:underline">
                      <Mail className="w-4 h-4" /> {sel.email}
                    </a>
                    {sel.telephone && (
                      <a href={`tel:${sel.telephone}`} className="flex items-center gap-2 text-vert hover:underline">
                        <Phone className="w-4 h-4" /> {sel.telephone}
                      </a>
                    )}
                  </>
                )}
              </div>

              {/* Trajet */}
              <div className="bg-vert-50 border border-vert-200 rounded-xl p-4">
                <div className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                  <MapPin className="w-4 h-4 text-rouge" /> {sel.depart}
                  <span className="text-gray-400">→</span>
                  <MapPin className="w-4 h-4 text-vert" /> {sel.arrivee}
                  {sel.aller_retour && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">↔ A/R</span>}
                </div>
                <p className="text-gray-600 text-sm flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(sel.date_voyage).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                {sel.aller_retour && sel.date_retour && (
                  <p className="text-gray-500 text-xs mt-1">Retour : {new Date(sel.date_retour).toLocaleDateString('fr-FR')}</p>
                )}
              </div>

              {/* Types acceptés */}
              <div>
                <p className="font-semibold mb-2">Accepte :</p>
                <div className="flex flex-wrap gap-1.5">
                  {(sel.types_acceptes || []).map((t: string) => (
                    <span key={t} className="text-xs bg-vert-50 text-vert px-2 py-1 rounded-full">{TYPES_LABELS[t] || t}</span>
                  ))}
                </div>
              </div>

              {sel.poids_max && <p><Package className="w-3.5 h-3.5 inline mr-1" /> Max : <strong>{sel.poids_max} kg</strong></p>}
              {sel.commentaire && <p className="bg-gray-50 p-3 rounded-lg italic text-gray-600">{sel.commentaire}</p>}
              <p className="text-xs text-gray-400">Soumis le {new Date(sel.created_at).toLocaleDateString('fr-FR')}</p>
            </div>

            {/* Actions */}
            {sel.statut === 'en_attente' && (
              <div className="flex gap-3 mt-6">
                <button onClick={() => updateStatut(sel.id, 'refuse')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rouge-50 text-rouge font-semibold hover:bg-rouge-100 border border-rouge-200">
                  <XCircle className="w-5 h-5" /> Refuser
                </button>
                <button onClick={() => updateStatut(sel.id, 'valide')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-vert text-white font-semibold hover:bg-vert-700">
                  <CheckCircle className="w-5 h-5" /> Valider & Publier
                </button>
              </div>
            )}
            {sel.statut === 'valide' && (
              <div className="flex gap-3 mt-6">
                <button onClick={() => updateStatut(sel.id, 'termine')}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm">
                  Marquer terminé
                </button>
                <button onClick={() => updateStatut(sel.id, 'refuse')}
                  className="flex-1 py-2.5 rounded-xl bg-rouge-50 text-rouge font-semibold text-sm border border-rouge-200">
                  Dépublier
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {selected.length > 0 && (
        <div className="flex items-center gap-3 bg-rouge-50 border border-rouge-200 rounded-xl p-3 mb-3">
          <span className="text-sm font-semibold text-rouge">{selected.length} sélectionné(s)</span>
          <button onClick={deleteSelected} className="flex items-center gap-1.5 text-xs bg-rouge text-white px-3 py-1.5 rounded-lg font-semibold">
            <Trash2 className="w-3.5 h-3.5" /> Supprimer
          </button>
          <button onClick={() => setSelected([])} className="text-xs text-gray-500 hover:underline ml-auto">Annuler</button>
        </div>
      )}
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
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Trajet</th>
              <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Date</th>
              <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Contacts</th>
              <th className="px-4 py-3 text-left font-semibold">Statut</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(t => (
              <tr key={t.id} className={`hover:bg-gray-50 ${t.statut === 'en_attente' ? 'bg-yellow-50/30' : ''}`}>
                <td className="px-4 py-3">
                  <button onClick={() => toggleSelect(t.id)} className="text-gray-400 hover:text-vert">
                    {selected.includes(t.id) ? <CheckSquare className="w-4 h-4 text-vert" /> : <Square className="w-4 h-4" />}
                  </button>
                </td>
                <td className="px-4 py-3 font-medium">{t.prenom} {t.nom}</td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell text-xs">
                  {t.depart} → {t.arrivee}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                  {new Date(t.date_voyage).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  {t.coordonnees_masquees ? (
                    <span className="text-xs text-rouge flex items-center gap-1"><EyeOff className="w-3 h-3" /> Masqués</span>
                  ) : (
                    <span className="text-xs text-vert flex items-center gap-1"><Eye className="w-3 h-3" /> Visibles</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${sC[t.statut] || ''}`}>{sL[t.statut]}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-1 justify-end">
                    {t.statut === 'en_attente' && (
                      <>
                        <button onClick={() => updateStatut(t.id, 'refuse')} className="p-1.5 rounded-lg text-rouge hover:bg-rouge-50" title="Refuser">
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => updateStatut(t.id, 'valide')} className="p-1.5 rounded-lg text-vert hover:bg-vert-50" title="Valider">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button onClick={() => toggleCoordonnees(t.id, !t.coordonnees_masquees)}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
                      title={t.coordonnees_masquees ? 'Afficher contacts' : 'Masquer contacts'}>
                      {t.coordonnees_masquees ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => deleteSingle(t.id)} className="p-1.5 rounded-lg text-rouge hover:bg-rouge-50" title="Supprimer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setSel(t)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100" title="Détails">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                <Plane className="w-8 h-8 mx-auto mb-2 opacity-30" />
                Aucune annonce
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
