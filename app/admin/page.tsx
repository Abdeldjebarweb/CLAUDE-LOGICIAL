'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { UserPlus, HelpCircle, Heart, Mail, Calendar, FileText } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const [memberships, helpRequests, donations, contacts, events, articles] = await Promise.all([
        supabase.from('memberships').select('*', { count: 'exact', head: true }),
        supabase.from('help_requests').select('*', { count: 'exact', head: true }),
        supabase.from('donations').select('*', { count: 'exact', head: true }),
        supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('events').select('*').eq('status', 'upcoming').order('date').limit(5),
        supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(5),
      ])
      setStats({
        memberships: memberships.count || 0,
        helpRequests: helpRequests.count || 0,
        donations: donations.count || 0,
        unreadContacts: contacts.count || 0,
        events: events.data || [],
        articles: articles.data || [],
      })
    }
    load()
  }, [])

  if (!stats) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-vert border-t-transparent rounded-full" /></div>

  const cards = [
    { icon: UserPlus, label: 'Adhésions', value: stats.memberships, color: 'bg-vert', text: 'text-vert' },
    { icon: HelpCircle, label: 'Demandes d\'aide', value: stats.helpRequests, color: 'bg-rouge', text: 'text-rouge' },
    { icon: Heart, label: 'Dons', value: stats.donations, color: 'bg-rouge-700', text: 'text-rouge-700' },
    { icon: Mail, label: 'Messages non lus', value: stats.unreadContacts, color: 'bg-vert-700', text: 'text-vert-700' },
  ]

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className={`${c.color} w-10 h-10 rounded-lg flex items-center justify-center text-white`}>
                <c.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{c.value}</p>
                <p className="text-xs text-gray-500">{c.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent events */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-vert" /> Prochains événements
          </h3>
          {stats.events.length > 0 ? (
            <ul className="space-y-3">
              {stats.events.map((e: any) => (
                <li key={e.id} className="flex items-center gap-3 text-sm">
                  <span className="w-12 text-center bg-vert-50 text-vert font-bold rounded-lg py-1 text-xs">
                    {new Date(e.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="text-gray-700 truncate">{e.title}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-400">Aucun événement à venir.</p>}
        </div>

        {/* Recent articles */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-vert" /> Derniers articles
          </h3>
          {stats.articles.length > 0 ? (
            <ul className="space-y-3">
              {stats.articles.map((a: any) => (
                <li key={a.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 truncate">{a.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${a.status === 'published' ? 'bg-vert-50 text-vert' : 'bg-gray-100 text-gray-500'}`}>
                    {a.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-400">Aucun article.</p>}
        </div>
      </div>
    </div>
  )
}
