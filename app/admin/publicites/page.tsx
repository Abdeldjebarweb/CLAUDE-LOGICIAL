'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, XCircle, Trash2, X, Eye, Phone, Mail, Star, Upload, Loader2 } from 'lucide-react'

const sC: Record<string, string> = {
  en_attente: 'bg-yellow-50 text-yellow-700',
  valide: 'bg-vert-50 text-vert',
  refuse: 'bg-rouge-50 text-rouge',
  expire: 'bg-gray-100 text-gray-500',
}
const sL: Record<string, string> = {
  en_attente: '⏳ En attente',
  valide: '✅ Validée',
  refuse: '❌ Refusée',
  expire: '⚪ Expirée',
}

export default function AdminPublicites() {
  const [pubs, setPubs] = useState<any[]>([])
  const [sel, setSel] = useState<any>(null)
  const [filter, setFilter] = useState('all')
  const [uploading, setUploading] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('publicites').select('*').order('created_at', { ascending: false })
    setPubs(data || [])
  }

  useEffect(() => {
    load()
    const i = setInterval(load, 30000)
    return () => clearInterval(i)
  }, [])

  const updateStatut = async (id: string, statut: string) => {
    const { error: _supaErr } = await supabase.from('publicites').update({ statut, date_debut: statut === 'valide' ? new Date().toISOString() : null }).eq('id', id)
    if (_supaErr) console.error("Supabase error:", _supaErr.message)
    if (sel?.id === id) setSel((p: any) => ({ ...p, statut }))
    load()
  }

  const updatePaiement = async (id: string, paiement_statut: string) => {
    await supabase.from('publicites').update({ paiement_statut }).eq('id', id)
    if (sel?.id === id) setSel((p: any) => ({ ...p, paiement_statut }))
    load()
  }

  const uploadLogo = async (id: string, file: File) => {
    setUploading(true)
    const fileName = `publicites/${id}-logo.${file.name.split('.').pop()}`
    await supabase.storage.from('documents').upload(fileName, file, { upsert: true })
    const { data } = supabase.storage.from('documents').getPublicUrl(fileName)
    await supabase.from('publicites').update({ logo_url: data.publicUrl }).eq('id', id)
    setUploading(false)
    load()
    if (sel?.id === id) setSel((p: any) => ({ ...p, logo_url: data.publicUrl }))
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer cette publicité ?')) return
    await supabase.from('publicites').delete().eq('id', id)
    setSel(null)
    load()
  }

  const filtered = filter === 'all' ? pubs : pubs.filter(p => p.statut === filter)
  const counts = {
    all: pubs.length,
    en_attente: pubs.filter(p => p.statut === 'en_attente').length,
    valide: pubs.filter(p => p.statut === 'valide').length,
  }

  const revenue = pubs.filter(p => p.statut === 'valide' && p.paiement_statut === 'paye')
    .reduce((sum, p) => sum + (p.prix_mensuel || 0), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold">Publicités professionnelles ({pubs.length})</h2>
          {counts.en_attente > 0 && <p className="text-sm text-yellow-600 font-semibold">⚠️ {counts.en_attente} en attente de validation</p>}
        </div>
        <div className="bg-vert-50 border border-vert-200 rounded-xl px-4 py-2 text-sm text-vert font-semibold">
          💰 Revenus ce mois : {revenue}€
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-5">
        {[
          { key: 'all', label: 'Toutes', count: counts.all },
          { key: 'en_attente', label: '⏳ En attente', count: counts.en_attente },
          { key: 'valide', label: '✅ Validées', count: counts.valide },
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
              <h3 className="font-heading font-bold text-lg">{sel.nom_entreprise}</h3>
              <button onClick={() => setSel(null)}><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              {/* Forfait & statut */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Forfait</p>
                  <p className="font-bold capitalize">{sel.forfait} — {sel.prix_mensuel}€/mois</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Paiement</p>
                  <p className={`font-bold text-sm ${sel.paiement_statut === 'paye' ? 'text-vert' : 'text-yellow-600'}`}>
                    {sel.paiement_statut === 'paye' ? '✅ Payé' : '⏳ En attente'}
                  </p>
                </div>
              </div>

              {/* Infos entreprise */}
              <div className="bg-vert-50 rounded-xl p-4 space-y-2 text-sm">
                <p><strong>Catégorie:</strong> {sel.categorie}</p>
                {sel.description && <p><strong>Description:</strong> {sel.description}</p>}
                {sel.adresse && <p><strong>Adresse:</strong> {sel.adresse}</p>}
                {sel.promo && <p className="text-rouge"><strong>Promo membres:</strong> {sel.promo}</p>}
              </div>

              {/* Contact */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-semibold text-xs text-gray-500 mb-2">Contact demandeur</p>
                <p><strong>{sel.contact_nom}</strong></p>
                {sel.contact_email && <a href={`mailto:${sel.contact_email}`} className="flex items-center gap-2 text-vert hover:underline"><Mail className="w-4 h-4" />{sel.contact_email}</a>}
                {sel.contact_telephone && <a href={`tel:${sel.contact_telephone}`} className="flex items-center gap-2 text-vert hover:underline"><Phone className="w-4 h-4" />{sel.contact_telephone}</a>}
              </div>

              {/* Upload logo */}
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Logo de l&apos;entreprise</p>
                <div className="flex items-center gap-3">
                  {sel.logo_url && <img src={sel.logo_url} alt="logo" className="w-12 h-12 rounded-lg object-cover" />}
                  <label className="cursor-pointer flex items-center gap-2 text-xs border rounded-lg px-3 py-2 hover:bg-gray-50">
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => e.target.files?.[0] && uploadLogo(sel.id, e.target.files[0])} />
                    {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Upload...</> : <><Upload className="w-4 h-4" /> Uploader logo</>}
                  </label>
                </div>
              </div>

              {/* Paiement */}
              <div className="flex gap-2">
                <button onClick={() => updatePaiement(sel.id, 'paye')}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 ${sel.paiement_statut === 'paye' ? 'border-vert bg-vert text-white' : 'border-vert text-vert hover:bg-vert-50'}`}>
                  ✅ Marquer payé
                </button>
                <button onClick={() => updatePaiement(sel.id, 'en_attente')}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50">
                  ⏳ En attente
                </button>
              </div>

              {/* Actions statut */}
              {sel.statut === 'en_attente' && (
                <div className="flex gap-3">
                  <button onClick={() => updateStatut(sel.id, 'refuse')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rouge-50 text-rouge font-semibold text-sm border border-rouge-200">
                    <XCircle className="w-4 h-4" /> Refuser
                  </button>
                  <button onClick={() => updateStatut(sel.id, 'valide')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-vert text-white font-semibold text-sm">
                    <CheckCircle className="w-4 h-4" /> Valider & Publier
                  </button>
                </div>
              )}
              {sel.statut === 'valide' && (
                <button onClick={() => updateStatut(sel.id, 'expire')}
                  className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm">
                  Marquer expirée
                </button>
              )}

              <button onClick={() => remove(sel.id)}
                className="w-full py-2 rounded-lg text-rouge text-sm hover:bg-rouge-50 flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" /> Supprimer définitivement
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
              <th className="px-4 py-3 text-left font-semibold">Entreprise</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Forfait</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Contact</th>
              <th className="px-4 py-3 text-left font-semibold">Paiement</th>
              <th className="px-4 py-3 text-left font-semibold">Statut</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(p => (
              <tr key={p.id} className={`hover:bg-gray-50 ${p.statut === 'en_attente' ? 'bg-yellow-50/30' : ''}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {p.logo_url
                      ? <img src={p.logo_url} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                      : <div className="w-8 h-8 rounded-lg bg-vert-50 flex items-center justify-center text-sm font-bold text-vert flex-shrink-0">{p.nom_entreprise[0]}</div>}
                    <div>
                      <p className="font-medium">{p.nom_entreprise}</p>
                      <p className="text-xs text-gray-400">{p.categorie}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${p.forfait === 'premium' ? 'bg-yellow-50 text-yellow-700' : p.forfait === 'standard' ? 'bg-vert-50 text-vert' : 'bg-gray-100 text-gray-600'}`}>
                    {p.forfait === 'premium' ? '⭐ ' : ''}{p.forfait} — {p.prix_mensuel}€
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-500">{p.contact_email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.paiement_statut === 'paye' ? 'bg-vert-50 text-vert' : 'bg-yellow-50 text-yellow-700'}`}>
                    {p.paiement_statut === 'paye' ? '✅ Payé' : '⏳ Attente'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${sC[p.statut]}`}>{sL[p.statut]}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-1 justify-end">
                    {p.statut === 'en_attente' && (
                      <>
                        <button onClick={() => updateStatut(p.id, 'refuse')} className="p-1.5 rounded-lg text-rouge hover:bg-rouge-50" title="Refuser">
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => updateStatut(p.id, 'valide')} className="p-1.5 rounded-lg text-vert hover:bg-vert-50" title="Valider">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button onClick={() => setSel(p)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100" title="Détails">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => remove(p.id)} className="p-1.5 rounded-lg text-rouge hover:bg-rouge-50" title="Supprimer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Aucune publicité</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
