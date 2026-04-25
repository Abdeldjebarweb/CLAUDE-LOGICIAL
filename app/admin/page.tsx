'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Users, HelpCircle, Mail, AlertTriangle, Plus, CheckSquare, BarChart2, TrendingUp, Calendar, Download } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    adhesions: 0, adhesions_pending: 0,
    demandes: 0, demandes_new: 0,
    messages: 0, messages_unread: 0,
    reservations: 0,
    membres: 0,
  })
  const [events, setEvents] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [recentDemandes, setRecentDemandes] = useState<any[]>([])
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [monthlyStats, setMonthlyStats] = useState<any[]>([])

  const load = useCallback(async () => {
    const [
      { count: adhesions }, { count: adhesions_pending },
      { count: demandes }, { count: demandes_new },
      { count: messages }, { count: messages_unread },
      { count: reservations }, { count: membres },
      { data: eventsData }, { data: articlesData },
      { data: recentD }, { data: recentM }
    ] = await Promise.all([
      supabase.from('memberships').select('*', { count: 'exact', head: true }),
      supabase.from('memberships').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('help_requests').select('*', { count: 'exact', head: true }),
      supabase.from('help_requests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('contacts').select('*', { count: 'exact', head: true }),
      supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('statut', 'nouveau'),
      supabase.from('reservations').select('*', { count: 'exact', head: true }),
      supabase.from('membre_accounts').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*').eq('status', 'upcoming').order('date').limit(3),
      supabase.from('articles').select('id, title, status, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('help_requests').select('first_name, last_name, status, urgency, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('contacts').select('nom, sujet, statut, created_at').order('created_at', { ascending: false }).limit(5),
    ])

    setStats({
      adhesions: adhesions || 0, adhesions_pending: adhesions_pending || 0,
      demandes: demandes || 0, demandes_new: demandes_new || 0,
      messages: messages || 0, messages_unread: messages_unread || 0,
      reservations: reservations || 0, membres: membres || 0,
    })
    setEvents(eventsData || [])
    setArticles(articlesData || [])
    setRecentDemandes(recentD || [])
    setRecentMessages(recentM || [])
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [load])

  const exportCSV = async (table: string, filename: string) => {
    const { data } = await supabase.from(table).select('*')
    if (!data) return
    const keys = Object.keys(data[0] || {})
    const csv = [keys.join(','), ...data.map(row => keys.map(k => `"${(row[k] ?? '').toString().replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${filename}.csv`; a.click()
  }

  const statCards = [
    { label: 'Adhésions', value: stats.adhesions, badge: stats.adhesions_pending ? `${stats.adhesions_pending} en attente` : null, icon: Users, color: 'text-vert', bg: 'bg-vert-50', href: '/admin/adhesions' },
    { label: 'Demandes d\'aide', value: stats.demandes, badge: stats.demandes_new ? `${stats.demandes_new} nouvelles` : null, icon: HelpCircle, color: 'text-rouge', bg: 'bg-rouge-50', href: '/admin/demandes' },
    { label: 'Messages', value: stats.messages, badge: stats.messages_unread ? `${stats.messages_unread} non lus` : null, icon: Mail, color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/messages' },
    { label: 'Réservations', value: stats.reservations, badge: null, icon: CheckSquare, color: 'text-purple-600', bg: 'bg-purple-50', href: '/admin/reservations' },
    { label: 'Membres inscrits', value: stats.membres, badge: null, icon: Users, color: 'text-vert', bg: 'bg-vert-50', href: '/admin/utilisateurs' },
  ]

  return (
    <div className="space-y-6">
      {/* Alertes */}
      {(stats.adhesions_pending > 0 || stats.demandes_new > 0 || stats.messages_unread > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <strong>Action requise : </strong>
            {[
              stats.adhesions_pending && `${stats.adhesions_pending} adhésion(s) en attente`,
              stats.demandes_new && `${stats.demandes_new} nouvelle(s) demande(s)`,
              stats.messages_unread && `${stats.messages_unread} message(s) non lu(s)`,
            ].filter(Boolean).join(' • ')}
          </div>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map(s => (
          <Link key={s.label} href={s.href} className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow">
            <div className={`${s.bg} ${s.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            {s.badge && <div className="text-xs text-rouge font-semibold mt-1">{s.badge}</div>}
          </Link>
        ))}
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link href="/admin/articles" className="flex items-center gap-2 bg-vert text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-vert-700 transition-colors">
          <Plus className="w-4 h-4" /> Nouvel article
        </Link>
        <Link href="/admin/evenements" className="flex items-center gap-2 bg-vert-700 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-vert-800 transition-colors">
          <Calendar className="w-4 h-4" /> Nouvel événement
        </Link>
        <Link href="/admin/adhesions" className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-yellow-600 transition-colors">
          <CheckSquare className="w-4 h-4" /> Adhésions
        </Link>
        <Link href="/admin/demandes" className="flex items-center gap-2 bg-rouge text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-rouge-700 transition-colors">
          <HelpCircle className="w-4 h-4" /> Demandes
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Événements à venir */}
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold flex items-center gap-2"><Calendar className="w-4 h-4 text-vert" /> Prochains événements</h3>
            <Link href="/admin/evenements" className="text-xs text-vert hover:underline">Gérer →</Link>
          </div>
          {events.length > 0 ? events.map(e => (
            <div key={e.id} className="flex items-center gap-3 py-2 border-b last:border-0">
              <div className="bg-vert-50 text-vert text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0">
                {new Date(e.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{e.title}</p>
                {e.location && <p className="text-xs text-gray-400 truncate">{e.location}</p>}
              </div>
            </div>
          )) : <p className="text-sm text-gray-400 py-4">Aucun événement à venir</p>}
          <Link href="/admin/evenements" className="text-xs text-vert mt-3 inline-block hover:underline">+ Créer un événement</Link>
        </div>

        {/* Derniers articles */}
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold flex items-center gap-2"><BarChart2 className="w-4 h-4 text-vert" /> Derniers articles</h3>
            <Link href="/admin/articles" className="text-xs text-vert hover:underline">Gérer →</Link>
          </div>
          {articles.length > 0 ? articles.map(a => (
            <div key={a.id} className="flex items-center gap-3 py-2 border-b last:border-0">
              <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${a.status === 'published' ? 'bg-vert-50 text-vert' : 'bg-gray-100 text-gray-500'}`}>
                {a.status === 'published' ? '✅' : '📝'}
              </span>
              <p className="text-sm flex-1 truncate">{a.title}</p>
              <p className="text-xs text-gray-400 flex-shrink-0">{new Date(a.created_at).toLocaleDateString('fr-FR')}</p>
            </div>
          )) : <p className="text-sm text-gray-400 py-4">Aucun article</p>}
        </div>

        {/* Dernières demandes */}
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold flex items-center gap-2"><HelpCircle className="w-4 h-4 text-rouge" /> Dernières demandes</h3>
            <Link href="/admin/demandes" className="text-xs text-vert hover:underline">Voir tout →</Link>
          </div>
          {recentDemandes.map((d, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
              <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${d.status === 'new' ? 'bg-rouge-50 text-rouge' : 'bg-gray-100 text-gray-500'}`}>
                {d.status === 'new' ? '🆕' : '⏳'}
              </span>
              <p className="text-sm flex-1 truncate">{d.first_name} {d.last_name}</p>
              <p className="text-xs text-gray-400 flex-shrink-0">{new Date(d.created_at).toLocaleDateString('fr-FR')}</p>
            </div>
          ))}
          {recentDemandes.length === 0 && <p className="text-sm text-gray-400 py-4">Aucune demande</p>}
        </div>

        {/* Derniers messages */}
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold flex items-center gap-2"><Mail className="w-4 h-4 text-blue-600" /> Derniers messages</h3>
            <Link href="/admin/messages" className="text-xs text-vert hover:underline">Voir tout →</Link>
          </div>
          {recentMessages.map((m, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${m.statut === 'nouveau' ? 'bg-vert' : 'bg-gray-300'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{m.nom}</p>
                <p className="text-xs text-gray-400 truncate">{m.sujet}</p>
              </div>
              <p className="text-xs text-gray-400 flex-shrink-0">{new Date(m.created_at).toLocaleDateString('fr-FR')}</p>
            </div>
          ))}
          {recentMessages.length === 0 && <p className="text-sm text-gray-400 py-4">Aucun message</p>}
        </div>
      </div>

      {/* Export données */}
      <div className="bg-white rounded-xl border p-5">
        <h3 className="font-heading font-bold mb-4 flex items-center gap-2"><Download className="w-4 h-4 text-vert" /> Exporter les données</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Adhésions CSV', table: 'memberships', file: 'adhesions' },
            { label: 'Membres CSV', table: 'membre_accounts', file: 'membres' },
            { label: 'Réservations CSV', table: 'reservations', file: 'reservations' },
            { label: 'Messages CSV', table: 'contacts', file: 'messages' },
            { label: 'Demandes CSV', table: 'help_requests', file: 'demandes' },
          ].map(e => (
            <button key={e.table} onClick={() => exportCSV(e.table, e.file)}
              className="text-xs flex items-center gap-1.5 border rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5 text-vert" /> {e.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
