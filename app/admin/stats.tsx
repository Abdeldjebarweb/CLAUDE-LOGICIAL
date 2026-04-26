'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { TrendingUp, Users, Calendar, Mail } from 'lucide-react'

export default function AdminStats() {
  const [data, setData] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      // Stats des 6 derniers mois
      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date()
        d.setMonth(d.getMonth() - (5 - i))
        return { month: d.toLocaleDateString('fr-FR', { month: 'short' }), year: d.getFullYear(), date: d }
      })

      const results = await Promise.all(months.map(async m => {
        const start = new Date(m.date.getFullYear(), m.date.getMonth(), 1).toISOString()
        const end = new Date(m.date.getFullYear(), m.date.getMonth() + 1, 0).toISOString()

        const [{ count: adhesions }, { count: demandes }, { count: messages }] = await Promise.all([
          supabase.from('memberships').select('*', { count: 'exact', head: true }).gte('created_at', start).lte('created_at', end),
          supabase.from('help_requests').select('*', { count: 'exact', head: true }).gte('created_at', start).lte('created_at', end),
          supabase.from('contacts').select('*', { count: 'exact', head: true }).gte('created_at', start).lte('created_at', end),
        ])

        return { month: m.month, adhesions: adhesions || 0, demandes: demandes || 0, messages: messages || 0 }
      }))

      setData({ monthly: results })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-6 h-6 border-4 border-vert border-t-transparent rounded-full" /></div>

  const monthly = data.monthly || []
  const maxVal = Math.max(...monthly.map((m: any) => Math.max(m.adhesions, m.demandes, m.messages)), 1)

  const series = [
    { key: 'adhesions', label: 'Adhésions', color: '#1a5c38', icon: Users },
    { key: 'demandes', label: 'Demandes d\'aide', color: '#c0392b', icon: Calendar },
    { key: 'messages', label: 'Messages', color: '#2980b9', icon: Mail },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-vert" />
        <h2 className="text-lg font-bold">Statistiques — 6 derniers mois</h2>
      </div>

      {/* Graphique barres */}
      <div className="bg-white rounded-2xl border p-6">
        <div className="flex items-end gap-3 h-48 mb-4">
          {monthly.map((m: any, i: number) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end gap-0.5 h-40">
                {series.map(s => (
                  <div key={s.key} className="flex-1 rounded-t-sm transition-all duration-500"
                    style={{ height: `${(m[s.key] / maxVal) * 100}%`, backgroundColor: s.color, minHeight: m[s.key] > 0 ? '4px' : '0' }}
                    title={`${s.label}: ${m[s.key]}`} />
                ))}
              </div>
              <span className="text-xs text-gray-400 font-medium">{m.month}</span>
            </div>
          ))}
        </div>

        {/* Légende */}
        <div className="flex flex-wrap gap-4 justify-center pt-3 border-t">
          {series.map(s => (
            <div key={s.key} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: s.color }} />
              <span className="text-gray-600">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Totaux */}
      <div className="grid grid-cols-3 gap-4">
        {series.map(s => {
          const total = monthly.reduce((sum: number, m: any) => sum + m[s.key], 0)
          return (
            <div key={s.key} className="bg-white rounded-xl border p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: s.color }}>{total}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label} (6 mois)</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
