'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const statusColors: Record<string, string> = { pending: 'bg-yellow-50 text-yellow-700', approved: 'bg-vert-50 text-vert', rejected: 'bg-rouge-50 text-rouge' }
const statusLabels: Record<string, string> = { pending: 'En attente', approved: 'Acceptée', rejected: 'Refusée' }

export default function AdminAdhesions() {
  const [items, setItems] = useState<any[]>([])
  const load = async () => { const { data } = await supabase.from('memberships').select('*').order('created_at', { ascending: false }); setItems(data || []) }
  useEffect(() => { load() }, [])

  const updateStatus = async (id: string, status: string) => { await supabase.from('memberships').update({ status }).eq('id', id); load() }

  return (
    <div>
      <h2 className="text-lg font-bold mb-6">Adhésions ({items.length})</h2>
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr>
            <th className="px-4 py-3 text-left font-semibold">Nom</th>
            <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Email</th>
            <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Établissement</th>
            <th className="px-4 py-3 text-left font-semibold">Statut</th>
            <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Date</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr></thead>
          <tbody className="divide-y">
            {items.map(m => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{m.first_name} {m.last_name}</td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{m.email}</td>
                <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{m.institution}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[m.status] || ''}`}>{statusLabels[m.status] || m.status}</span></td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">{new Date(m.created_at).toLocaleDateString('fr-FR')}</td>
                <td className="px-4 py-3 text-right space-x-1">
                  {m.status !== 'approved' && <button onClick={() => updateStatus(m.id, 'approved')} className="text-xs text-vert font-semibold hover:underline">Accepter</button>}
                  {m.status !== 'rejected' && <button onClick={() => updateStatus(m.id, 'rejected')} className="text-xs text-rouge font-semibold hover:underline">Refuser</button>}
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Aucune adhésion</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
