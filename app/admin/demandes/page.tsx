'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, XCircle, FileText, Download, Eye, ExternalLink, Loader2, Filter } from 'lucide-react'

const sC: Record<string, string> = {
  new: 'bg-rouge-50 text-rouge',
  in_progress: 'bg-yellow-50 text-yellow-700',
  resolved: 'bg-vert-50 text-vert',
  closed: 'bg-gray-100 text-gray-500',
}
const sL: Record<string, string> = {
  new: 'Nouvelle',
  in_progress: 'En cours',
  resolved: 'Résolue',
  closed: 'Fermée',
}

function generateAttestationPDF(demande: any): void {
  const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Attestation sur l'honneur</title>
<style>body{font-family:Arial,sans-serif;max-width:700px;margin:60px auto;color:#222;line-height:1.7}
.header{text-align:center;border-bottom:3px solid #006233;padding-bottom:20px;margin-bottom:40px}
.logo{font-size:24px;font-weight:bold;color:#006233}.subtitle{color:#555;font-size:14px;margin-top:4px}
h1{text-align:center;font-size:20px;text-transform:uppercase;letter-spacing:2px;margin:30px 0;color:#006233}
.info-box{background:#f5f5f5;border-left:4px solid #006233;padding:16px 20px;margin:24px 0;border-radius:4px}
.info-row{display:flex;gap:8px;margin:6px 0}.label{font-weight:bold;min-width:180px}
.signature-area{margin-top:60px;display:flex;justify-content:space-between}
.sig-block{text-align:center}.sig-line{border-top:1px solid #999;width:200px;margin:40px auto 8px}
.footer{margin-top:60px;border-top:1px solid #ddd;padding-top:16px;font-size:11px;color:#888;text-align:center}
.stamp{border:2px solid #006233;border-radius:50%;width:120px;height:120px;margin:20px auto;display:flex;align-items:center;justify-content:center;text-align:center;font-size:11px;font-weight:bold;color:#006233}
@media print{body{margin:20px}}</style></head><body>
<div class="header"><div class="logo">☪ AEAB</div>
<div class="subtitle">Association des Étudiants Algériens de Bordeaux</div>
<div style="font-size:12px;color:#888;margin-top:6px">associationeab@gmail.com — 06 70 37 67 67</div></div>
<h1>Attestation sur l'honneur</h1>
<p>L'Association des Étudiants Algériens de Bordeaux (AEAB), association loi 1901 dont le siège social est à Bordeaux, France, représentée par son bureau,</p>
<p><strong>ATTESTE SUR L'HONNEUR</strong> avoir examiné la demande d'aide présentée par :</p>
<div class="info-box">
<div class="info-row"><span class="label">Nom et prénom :</span><span>${demande.first_name} ${demande.last_name}</span></div>
<div class="info-row"><span class="label">Email :</span><span>${demande.email}</span></div>
<div class="info-row"><span class="label">Téléphone :</span><span>${demande.phone || '—'}</span></div>
<div class="info-row"><span class="label">Établissement :</span><span>${demande.institution || '—'}</span></div>
<div class="info-row"><span class="label">Filière :</span><span>${demande.field || '—'}</span></div>
<div class="info-row"><span class="label">Type d'aide demandée :</span><span>${demande.help_type}</span></div>
<div class="info-row"><span class="label">Date de la demande :</span><span>${new Date(demande.created_at).toLocaleDateString('fr-FR')}</span></div>
</div>
<p>Après examen des pièces justificatives fournies, l'AEAB <strong>valide et approuve</strong> la présente demande d'aide.</p>
<p>La présente attestation est délivrée à l'intéressé(e) pour servir et valoir ce que de droit.</p>
<div class="stamp">AEAB<br/>VALIDÉ<br/>${new Date().getFullYear()}</div>
<div class="signature-area">
<div class="sig-block"><div class="sig-line"></div><div style="font-size:13px;color:#555">Le/La Bénéficiaire</div><div style="font-size:12px;color:#888">${demande.first_name} ${demande.last_name}</div></div>
<div class="sig-block"><div class="sig-line"></div><div style="font-size:13px;color:#555">Pour l'Association AEAB</div><div style="font-size:12px;color:#888">Le Président / La Présidente</div></div>
</div>
<div class="footer">Document généré le ${today} — Association des Étudiants Algériens de Bordeaux (AEAB)<br/>associationeab@gmail.com — 06 70 37 67 67 — Bordeaux, France</div>
</body></html>`
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
  const a = document.createElement('a')
  a.href = url
  a.download = `attestation-${demande.first_name}-${demande.last_name}.html`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 3000)
}

export default function AdminDemandes() {
  const [items, setItems] = useState<any[]>([])
  const [sel, setSel] = useState<any>(null)
  const [filter, setFilter] = useState<string>('all')
  const [generatingPDF, setGeneratingPDF] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('help_requests').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter)

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('help_requests').update({ status }).eq('id', id)
    if (sel?.id === id) setSel((prev: any) => ({ ...prev, status }))
    load()
  }

  const handleAccepter = async (demande: any) => {
    setGeneratingPDF(true)
    await updateStatus(demande.id, 'resolved')
    generateAttestationPDF(demande)
    setGeneratingPDF(false)
    alert(`✅ Demande acceptée !\n\nL'attestation s'est ouverte dans un nouvel onglet.\nFaites Ctrl+P pour l'imprimer en PDF, puis envoyez-la à ${demande.email}`)
  }

  const handleRefuser = async (demande: any) => {
    if (!confirm(`Refuser la demande de ${demande.first_name} ${demande.last_name} ?`)) return
    await updateStatus(demande.id, 'closed')
    if (sel?.id === demande.id) setSel(null)
  }

  const counts = {
    all: items.length,
    new: items.filter(i => i.status === 'new').length,
    in_progress: items.filter(i => i.status === 'in_progress').length,
    resolved: items.filter(i => i.status === 'resolved').length,
    closed: items.filter(i => i.status === 'closed').length,
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-lg font-bold">Demandes d&apos;aide ({items.length})</h2>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { key: 'all', label: 'Toutes', count: counts.all },
          { key: 'new', label: '🔴 Nouvelles', count: counts.new },
          { key: 'in_progress', label: '🟡 En cours', count: counts.in_progress },
          { key: 'resolved', label: '🟢 Résolues', count: counts.resolved },
          { key: 'closed', label: '⚪ Fermées', count: counts.closed },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${filter === f.key ? 'bg-vert text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Modal */}
      {sel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSel(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">{sel.first_name} {sel.last_name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${sC[sel.status] || ''}`}>{sL[sel.status] || sel.status}</span>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg">
                <p><b>Email :</b> {sel.email}</p>
                <p><b>Tél :</b> {sel.phone}</p>
                <p><b>Type :</b> {sel.help_type}</p>
                <p><b>Urgence :</b> {sel.urgency}</p>
                <p><b>Établissement :</b> {sel.institution || '—'}</p>
                <p><b>Filière :</b> {sel.field || '—'}</p>
              </div>
              {sel.situation && <p><b>Situation :</b> {sel.situation}</p>}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-semibold mb-1">Description :</p>
                <p className="whitespace-pre-wrap">{sel.description}</p>
              </div>

              {/* Documents */}
              {(sel.passport_url || sel.inscription_url) && (
                <div className="border border-vert-200 rounded-xl p-4 bg-vert-50">
                  <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-vert" /> Documents joints
                  </p>
                  <div className="space-y-2">
                    {sel.passport_url && (
                      <a href={sel.passport_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-vert hover:underline">
                        <ExternalLink className="w-4 h-4" /> Voir le passeport
                      </a>
                    )}
                    {sel.inscription_url && (
                      <a href={sel.inscription_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-vert hover:underline">
                        <ExternalLink className="w-4 h-4" /> Voir l&apos;attestation d&apos;inscription
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {sel.status !== 'resolved' && sel.status !== 'closed' && (
              <div className="flex gap-3 mt-6">
                <button onClick={() => handleRefuser(sel)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rouge-50 text-rouge font-semibold hover:bg-rouge-100 border border-rouge-200 transition-colors">
                  <XCircle className="w-5 h-5" /> Refuser
                </button>
                <button onClick={() => handleAccepter(sel)} disabled={generatingPDF}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-vert text-white font-semibold hover:bg-vert-700 transition-colors">
                  {generatingPDF ? <><Loader2 className="w-5 h-5 animate-spin" /> Génération...</> : <><CheckCircle className="w-5 h-5" /> Accepter & PDF</>}
                </button>
              </div>
            )}
            {sel.status === 'resolved' && (
              <button onClick={() => generateAttestationPDF(sel)}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-vert-50 text-vert font-semibold hover:bg-vert-100 border border-vert-200 transition-colors">
                <Download className="w-5 h-5" /> Re-télécharger l&apos;attestation
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tableau */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Nom</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Type</th>
              <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Docs</th>
              <th className="px-4 py-3 text-left font-semibold">Urgence</th>
              <th className="px-4 py-3 text-left font-semibold">Statut</th>
              <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Date</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium cursor-pointer" onClick={() => setSel(r)}>
                  {r.first_name} {r.last_name}
                </td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell text-xs">{r.help_type}</td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {r.passport_url && <span className="text-xs bg-vert-50 text-vert px-1.5 py-0.5 rounded">📎 Passeport</span>}
                    {r.inscription_url && <span className="text-xs bg-vert-50 text-vert px-1.5 py-0.5 rounded">📎 Inscription</span>}
                    {!r.passport_url && !r.inscription_url && <span className="text-xs text-gray-400">—</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.urgency === 'critical' ? 'bg-rouge-100 text-rouge font-bold' : r.urgency === 'high' ? 'bg-orange-50 text-orange-700' : 'bg-yellow-50 text-yellow-700'}`}>
                    {r.urgency === 'critical' ? '🔴 Urgente' : r.urgency === 'high' ? '🟠 Élevée' : r.urgency === 'low' ? '🟢 Faible' : '🟡 Moyenne'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${sC[r.status] || ''}`}>{sL[r.status] || r.status}</span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                  {new Date(r.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-1 justify-end">
                    {r.status !== 'resolved' && r.status !== 'closed' && (
                      <>
                        <button onClick={() => handleRefuser(r)} className="p-1.5 rounded-lg text-rouge hover:bg-rouge-50" title="Refuser">
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleAccepter(r)} className="p-1.5 rounded-lg text-vert hover:bg-vert-50" title="Accepter">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {r.status === 'resolved' && (
                      <button onClick={() => generateAttestationPDF(r)} className="p-1.5 rounded-lg text-vert hover:bg-vert-50" title="PDF">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => setSel(r)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100" title="Détails">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Aucune demande {filter !== 'all' ? `avec le statut "${sL[filter]}"` : ''}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
