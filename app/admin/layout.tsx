'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, FileText, Calendar, Users, Handshake, Image,
  UserPlus, HelpCircle, Heart, Mail, Settings, LogOut, Menu, X,
  Vote, Bell, Newspaper, Car
} from 'lucide-react'

const links = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/articles', label: 'Articles', icon: FileText },
  { href: '/admin/evenements', label: 'Événements', icon: Calendar },
  { href: '/admin/equipe', label: 'Équipe', icon: Users },
  { href: '/admin/partenaires', label: 'Partenaires', icon: Handshake },
  { href: '/admin/galerie', label: 'Galerie', icon: Image },
  { href: '/admin/adhesions', label: 'Adhésions', icon: UserPlus },
  { href: '/admin/demandes', label: "Demandes d'aide", icon: HelpCircle },
  { href: '/admin/dons', label: 'Dons', icon: Heart },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Newspaper },
  { href: '/admin/votes', label: 'Votes & Sondages', icon: Vote },
  { href: '/admin/benevoles', label: 'Bénévoles', icon: Bell },
  { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [alerts, setAlerts] = useState({ adhesions: 0, demandes: 0, messages: 0 })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/auth/login')
      else {
        setLoading(false)
        // Load alert counts
        Promise.all([
          supabase.from('memberships').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('help_requests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
          supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('is_read', false),
        ]).then(([m, h, c]) => {
          setAlerts({ adhesions: m.count || 0, demandes: h.count || 0, messages: c.count || 0 })
        })
      }
    })
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const getAlert = (href: string) => {
    if (href === '/admin/adhesions') return alerts.adhesions
    if (href === '/admin/demandes') return alerts.demandes
    if (href === '/admin/messages') return alerts.messages
    return 0
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin w-8 h-8 border-4 border-vert border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 admin-sidebar transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}>
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">☪</div>
            <span className="font-heading font-bold">AEAB Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="space-y-0.5">
          {links.map(l => {
            const alert = getAlert(l.href)
            return (
              <Link key={l.href} href={l.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${pathname === l.href ? 'active bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
                <span className="flex items-center gap-3">
                  <l.icon className="w-4 h-4 flex-shrink-0" />
                  {l.label}
                </span>
                {alert > 0 && (
                  <span className="bg-rouge text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                    {alert}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="mt-6 pt-6 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm w-full">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
          <Link href="/" className="block px-4 py-2.5 rounded-lg text-white/40 hover:text-white/60 transition-all text-xs mt-1">
            ← Retour au site
          </Link>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 h-16 flex items-center gap-4 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="font-heading font-bold text-lg text-gray-900 truncate">
            {links.find(l => l.href === pathname)?.label || 'Admin'}
          </h2>
          {/* Alertes rapides header */}
          <div className="ml-auto flex items-center gap-3">
            {alerts.adhesions > 0 && (
              <Link href="/admin/adhesions" className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold hover:bg-yellow-200 transition-colors">
                {alerts.adhesions} adhésion(s)
              </Link>
            )}
            {alerts.demandes > 0 && (
              <Link href="/admin/demandes" className="text-xs bg-rouge-50 text-rouge px-2 py-1 rounded-full font-semibold hover:bg-rouge-100 transition-colors">
                {alerts.demandes} demande(s)
              </Link>
            )}
          </div>
        </header>
        <main className="p-4 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  )
}
