'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Briefcase, CheckCircle, XCircle, Trash2, Eye } from 'lucide-react'

export default function AdminAnnonces() {
  const [annonces, setAnnonces] = useState<any[]>([])

  const load = async () => {
    const { data } = await supabase.from('annonces_emploi').select('*').order('created_at', { ascending: false })
    setAnnonces(data || [])
  }

  useEffect(() => { load(); const i = setInterval(load, 30000); return () => clearInterval(i) }, [])

  const updateStatut = async (id: string, statut: string) => {
    await supabase.from('annonces_emploi').update({ statut }).eq('id', id)
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer cette annonce ?')) return
    await supabase.from('annonces_emploi').delete().eq('id', id)
    load()
  }

  const counts = {
    all: annonces.length,
    en_attente: annonces.filter(a => a.statut === 'en_attente').length,
    publiee: annonces.filter(a => a.statut === 'publiee').length,
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold">Annonces emploi & stage ({annonces.length})</h2>
          {counts.en_attente > 0 && <p className="text-sm text-yellow-600 font-semibold">⚠️ {counts.en_attente} en attente de validation</p>}
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Poste</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Type</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Contact</th>
              <th className="px-4 py-3 text-left font-semibold">Statut</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {annonces.map(a => (
              <tr key={a.id} className={`hover:bg-gray-50 ${a.statut === 'en_attente' ? 'bg-yellow-50/30' : ''}`}>
                <td className="px-4 py-3">
                  <p className="font-medium">{a.titre}</p>
                  {a.entreprise && <p className="text-xs text-gray-500">{a.entreprise}</p>}
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-500">{a.type} • {a.lieu}</td>
                <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-500">{a.contact}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${a.statut === 'publiee' ? 'bg-vert-50 text-vert' : a.statut === 'en_attente' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                    {a.statut === 'publiee' ? '✅ Publiée' : a.statut === 'en_attente' ? '⏳ En attente' : '⚪ Expirée'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-1 justify-end">
                    {a.statut === 'en_attente' && (
                      <button onClick={() => updateStatut(a.id, 'publiee')} className="p-1.5 rounded-lg text-vert hover:bg-vert-50" title="Publier">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {a.statut === 'publiee' && (
                      <button onClick={() => updateStatut(a.id, 'expiree')} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100" title="Expirer">
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => remove(a.id)} className="p-1.5 rounded-lg text-rouge hover:bg-rouge-50" title="Supprimer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {annonces.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-30" />
                Aucune annonce
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
