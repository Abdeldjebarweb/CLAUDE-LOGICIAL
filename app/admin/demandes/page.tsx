'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const sC: Record<string,string> = { new: 'bg-rouge-50 text-rouge', in_progress: 'bg-yellow-50 text-yellow-700', resolved: 'bg-vert-50 text-vert', closed: 'bg-gray-100 text-gray-500' }
const sL: Record<string,string> = { new: 'Nouvelle', in_progress: 'En cours', resolved: 'Résolue', closed: 'Fermée' }

export default function AdminDemandes() {
  const [items, setItems] = useState<any[]>([])
  const [sel, setSel] = useState<any>(null)
  const load = async () => { const { data } = await supabase.from('help_requests').select('*').order('created_at', { ascending: false }); setItems(data || []) }
  useEffect(() => { load() }, [])
  const upd = async (id: string, status: string) => { await supabase.from('help_requests').update({ status }).eq('id', id); load() }

  return (
    <div>
      <h2 className="text-lg font-bold mb-6">Demandes d&apos;aide ({items.length})</h2>
      {sel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSel(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-heading font-bold text-lg mb-4">{sel.first_name} {sel.last_name}</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><b>Email :</b> {sel.email} | <b>Tél :</b> {sel.phone}</p>
              <p><b>Type :</b> {sel.help_type} | <b>Urgence :</b> {sel.urgency}</p>
              <p><b>Situation :</b> {sel.situation}</p>
              <div className="bg-gray-50 p-3 rounded-lg mt-2 whitespace-pre-wrap">{sel.description}</div>
              <div className="flex gap-2 pt-4">
                {Object.entries(sL).map(([k,v]) => (
                  <button key={k} onClick={() => { upd(sel.id, k); setSel({...sel, status: k}) }} className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${sel.status===k ? 'bg-vert text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{v}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left font-semibold">Nom</th><th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Type</th><th className="px-4 py-3 text-left font-semibold">Urgence</th><th className="px-4 py-3 text-left font-semibold">Statut</th><th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Date</th></tr></thead>
          <tbody className="divide-y">
            {items.map(r => (
              <tr key={r.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSel(r)}>
                <td className="px-4 py-3 font-medium">{r.first_name} {r.last_name}</td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{r.help_type}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">{r.urgency}</span></td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${sC[r.status]||''}`}>{sL[r.status]||r.status}</span></td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
            {items.length===0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Aucune demande</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
