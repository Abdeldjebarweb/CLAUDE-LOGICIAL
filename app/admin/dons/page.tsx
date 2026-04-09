'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDons() {
  const [items, setItems] = useState<any[]>([])
  useEffect(() => { supabase.from('donations').select('*').order('created_at', { ascending: false }).then(({ data }) => setItems(data || [])) }, [])
  const total = items.filter(d => d.status === 'completed').reduce((s, d) => s + (d.amount || 0), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Dons ({items.length})</h2>
        <div className="bg-vert-50 text-vert font-bold px-4 py-2 rounded-lg text-sm">Total : {total.toFixed(2)} €</div>
      </div>
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left font-semibold">Donateur</th><th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Email</th><th className="px-4 py-3 text-left font-semibold">Montant</th><th className="px-4 py-3 text-left font-semibold">Statut</th><th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Date</th></tr></thead>
          <tbody className="divide-y">
            {items.map(d => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{d.donor_name}</td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{d.donor_email}</td>
                <td className="px-4 py-3 font-bold text-vert">{d.amount?.toFixed(2)} €</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${d.status==='completed'?'bg-vert-50 text-vert':'bg-yellow-50 text-yellow-700'}`}>{d.status==='completed'?'Reçu':'En attente'}</span></td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">{new Date(d.created_at).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
            {items.length===0&&<tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Aucun don</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
