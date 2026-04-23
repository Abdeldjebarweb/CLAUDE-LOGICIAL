'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { UserPlus, HelpCircle, Mail, Calendar, FileText, AlertTriangle } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [m, h, c, ev, ar] = await Promise.all([
        supabase.from('memberships').select('id, status'),
        supabase.from('help_requests').select('id, status, urgency'),
        supabase.from('contacts').select('id, statut, is_read'),
        supabase.from('events').select('id, title, date').eq('status', 'upcoming').order('date').limit(5),
        supabase.from('articles').select('id, title, status').order('created_at', { ascending: false }).limit(5),
      ])

      const memberships = m.data || []
      const helpReqs = h.data || []
      const contacts = c.data || []

      setStats({
        totalMemberships: memberships.length,
        pendingMemberships: memberships.filter(x => x.status === 'pending').length,
        totalHelp: helpReqs.length,
        newHelp: helpReqs.filter(x => x.status === 'new').length,
        criticalHelp: helpReqs.filter(x => x.urgency === 'critical' && x.status === 'new').length,
        unreadContacts: contacts.filter(x => x.statut === 'nouveau' || x.is_read === false).length,
        events: ev.data || [],
        articles: ar.data || [],
      })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-vert border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Alertes urgentes */}
      <div className="space-y-2">
        {stats.criticalHelp > 0 && (
          <div className="bg-rouge-50 border border-rouge-200 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rouge flex-shrink-0" />
            <p className="text-sm font-semibold text-rouge flex-1">{stats.criticalHelp} demande(s) URGENTE(S) !</p>
            <Link href="/admin/demandes" className="text-xs bg-rouge text-white px-3 py-1.5 rounded-lg">Traiter →</Link>
          </div>
        )}
        {stats.pendingMemberships > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
            <UserPlus className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm font-semibold text-yellow-700 flex-1">{stats.pendingMemberships} adhésion(s) en attente</p>
            <Link href="/admin/adhesions" className="text-xs bg-yellow-500 text-white px-3 py-1.5 rounded-lg">Valider →</Link>
          </div>
        )}
        {stats.unreadContacts > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm font-semibold text-blue-700 flex-1">{stats.unreadContacts} message(s) non lu(s)</p>
            <Link href="/admin/messages" className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg">Lire →</Link>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: UserPlus, label: 'Total adhésions', value: stats.totalMemberships, color: 'bg-vert', href: '/admin/adhesions' },
          { icon: HelpCircle, label: "Demandes d'aide", value: stats.totalHelp, color: 'bg-rouge', href: '/admin/demandes' },
          { icon: Mail, label: 'Messages non lus', value: stats.unreadContacts, color: 'bg-blue-500', href: '/admin/messages' },
          { icon: AlertTriangle, label: 'En attente valid.', value: stats.pendingMemberships, color: 'bg-yellow-500', href: '/admin/adhesions' },
        ].map(c => (
          <Link key={c.label} href={c.href}
            className="bg-white rounded-xl border p-5 hover:-translate-y-0.5 transition-transform no-underline">
            <div className="flex items-center gap-3">
              <div className={`${c.color} w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                <c.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{c.value}</p>
                <p className="text-xs text-gray-500">{c.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: '/admin/articles', label: '+ Article', color: 'bg-vert text-white' },
          { href: '/admin/evenements', label: '+ Événement', color: 'bg-vert-700 text-white' },
          { href: '/admin/adhesions', label: '✅ Adhésions', color: 'bg-yellow-500 text-white' },
          { href: '/admin/demandes', label: '📩 Demandes', color: 'bg-rouge text-white' },
        ].map(a => (
          <Link key={a.href} href={a.href}
            className={`${a.color} rounded-xl p-3 text-center text-sm font-semibold hover:opacity-90 transition-opacity no-underline`}>
            {a.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Événements */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-vert" /> Prochains événements
          </h3>
          {stats.events.length > 0 ? (
            <ul className="space-y-3">
              {stats.events.map((e: any) => (
                <li key={e.id} className="flex items-center gap-3 text-sm">
                  <span className="w-14 text-center bg-vert-50 text-vert font-bold rounded-lg py-1.5 text-xs flex-shrink-0">
                    {new Date(e.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="text-gray-700 truncate">{e.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <p className="text-sm">Aucun événement à venir.</p>
              <Link href="/admin/evenements" className="text-xs text-vert mt-1 block hover:underline">+ Créer</Link>
            </div>
          )}
        </div>

        {/* Articles */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-vert" /> Derniers articles
          </h3>
          {stats.articles.length > 0 ? (
            <ul className="space-y-3">
              {stats.articles.map((a: any) => (
                <li key={a.id} className="flex items-center justify-between text-sm gap-3">
                  <span className="text-gray-700 truncate">{a.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${a.status === 'published' ? 'bg-vert-50 text-vert' : 'bg-gray-100 text-gray-500'}`}>
                    {a.status === 'published' ? '✅' : '📝'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 text-gray-400">
              <p className="text-sm">Aucun article.</p>
              <Link href="/admin/articles" className="text-xs text-vert mt-1 block hover:underline">+ Créer</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
