'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { UserPlus, HelpCircle, Heart, Mail, Calendar, FileText, Clock, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [memberships, helpRequests, donations, contacts, events, articles, pendingHelp, criticalHelp] = await Promise.all([
        supabase.from('memberships').select('*', { count: 'exact', head: true }),
        supabase.from('help_requests').select('*', { count: 'exact', head: true }),
        supabase.from('donations').select('*', { count: 'exact', head: true }),
        supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('events').select('*').eq('status', 'upcoming').order('date').limit(5),
        supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('memberships').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('help_requests').select('*', { count: 'exact', head: true }).eq('urgency', 'critical').eq('status', 'new'),
      ])
      setStats({
        memberships: memberships.count || 0,
        helpRequests: helpRequests.count || 0,
        donations: donations.count || 0,
        unreadContacts: contacts.count || 0,
        pendingMemberships: pendingHelp.count || 0,
        criticalRequests: criticalHelp.count || 0,
        events: events.data || [],
        articles: articles.data || [],
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
    <div className="space-y-8">

      {/* Alertes urgentes */}
      {(stats.criticalRequests > 0 || stats.pendingMemberships > 0 || stats.unreadContacts > 0) && (
        <div className="space-y-3">
          {stats.criticalRequests > 0 && (
            <div className="bg-rouge-50 border border-rouge-200 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rouge flex-shrink-0" />
              <p className="text-sm font-semibold text-rouge">{stats.criticalRequests} demande(s) d&apos;aide URGENTE(S) en attente</p>
              <Link href="/admin/demandes" className="ml-auto text-xs bg-rouge text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-rouge-700">
                Traiter →
              </Link>
            </div>
          )}
          {stats.pendingMemberships > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <p className="text-sm font-semibold text-yellow-700">{stats.pendingMemberships} adhésion(s) en attente de validation</p>
              <Link href="/admin/adhesions" className="ml-auto text-xs bg-yellow-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-yellow-600">
                Valider →
              </Link>
            </div>
          )}
          {stats.unreadContacts > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-sm font-semibold text-blue-700">{stats.unreadContacts} message(s) non lu(s)</p>
              <Link href="/admin/messages" className="ml-auto text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-600">
                Lire →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: UserPlus, label: 'Adhésions totales', value: stats.memberships, color: 'bg-vert', href: '/admin/adhesions' },
          { icon: HelpCircle, label: "Demandes d'aide", value: stats.helpRequests, color: 'bg-rouge', href: '/admin/demandes' },
          { icon: Heart, label: 'Dons reçus', value: stats.donations, color: 'bg-rouge-700', href: '/admin/dons' },
          { icon: Mail, label: 'Messages non lus', value: stats.unreadContacts, color: 'bg-vert-700', href: '/admin/messages' },
        ].map(c => (
          <Link key={c.label} href={c.href} className="bg-white rounded-xl border border-gray-200 p-5 hover:-translate-y-0.5 transition-transform no-underline group">
            <div className="flex items-center gap-3">
              <div className={`${c.color} w-10 h-10 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
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
      <div>
        <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-vert" /> Actions rapides
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/admin/articles', label: '+ Nouvel article', color: 'bg-vert text-white' },
            { href: '/admin/evenements', label: '+ Nouvel événement', color: 'bg-vert-700 text-white' },
            { href: '/admin/adhesions', label: 'Valider adhésions', color: 'bg-yellow-500 text-white' },
            { href: '/admin/demandes', label: 'Traiter demandes', color: 'bg-rouge text-white' },
          ].map(a => (
            <Link key={a.href} href={a.href} className={`${a.color} rounded-xl p-3 text-center text-sm font-semibold hover:opacity-90 transition-opacity no-underline`}>
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Événements */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
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
                  <span className="ml-auto text-xs text-gray-400 flex-shrink-0">{e.location}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucun événement à venir.</p>
              <Link href="/admin/evenements" className="text-xs text-vert mt-2 block hover:underline">+ Créer un événement</Link>
            </div>
          )}
        </div>

        {/* Articles */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-vert" /> Derniers articles
          </h3>
          {stats.articles.length > 0 ? (
            <ul className="space-y-3">
              {stats.articles.map((a: any) => (
                <li key={a.id} className="flex items-center justify-between text-sm gap-3">
                  <span className="text-gray-700 truncate">{a.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${a.status === 'published' ? 'bg-vert-50 text-vert' : 'bg-gray-100 text-gray-500'}`}>
                    {a.status === 'published' ? '✅ Publié' : '📝 Brouillon'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucun article.</p>
              <Link href="/admin/articles" className="text-xs text-vert mt-2 block hover:underline">+ Créer un article</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
