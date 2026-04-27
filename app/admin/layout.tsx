'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, FileText, Calendar, Users, Handshake, Image,
  UserPlus, HelpCircle, Heart, Mail, Settings, LogOut, Menu, X,
  Vote, Bell, Newspaper, Car, Plane, Shield, UserCog, TicketCheck, Briefcase, Megaphone
} from 'lucide-react'

const links = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/articles', label: 'Articles', icon: FileText },
  { href: '/admin/evenements', label: 'Événements', icon: Calendar },
  { href: '/admin/reservations', label: 'Réservations', icon: TicketCheck },
  { href: '/admin/annonces', label: 'Annonces emploi', icon: Briefcase },
  { href: '/admin/publicites', label: 'Espace pub pro', icon: Megaphone },
  { href: '/admin/equipe', label: 'Équipe', icon: Users },
  { href: '/admin/partenaires', label: 'Partenaires', icon: Handshake },
  { href: '/admin/galerie', label: 'Galerie', icon: Image },
  { href: '/admin/adhesions', label: 'Adhésions', icon: UserPlus },
  { href: '/admin/demandes', label: "Demandes d'aide", icon: HelpCircle },
  { href: '/admin/dons', label: 'Dons', icon: Heart },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Newspaper },
  { href: '/admin/covoiturage', label: 'Covoiturage', icon: Car },
  { href: '/admin/transporteurs', label: 'Transporteurs', icon: Plane },
  { href: '/admin/votes', label: 'Votes & Sondages', icon: Vote },
  { href: '/admin/benevoles', label: 'Bénévoles', icon: Bell },
  { href: '/admin/utilisateurs', label: 'Utilisateurs', icon: UserCog },
  { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
]

// Timeout de session : 2 heures
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [alerts, setAlerts] = useState({ adhesions: 0, demandes: 0, messages: 0, transporteurs: 0 })
  const [lastActivity, setLastActivity] = useState(Date.now())

  // Vérification de session avec timeout
  const checkSession = useCallback(async () => {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      router.push('/auth/login')
      return false
    }

    // Vérifier le timeout de session
    if (Date.now() - lastActivity > SESSION_TIMEOUT) {
      await supabase.auth.signOut()
      router.push('/auth/login?reason=timeout')
      return false
    }

    // Vérifier que l'utilisateur est bien un admin (pas dans membre_accounts)
    const { data: membreData } = await supabase
      .from('membre_accounts')
      .select('id')
      .eq('id', user.id)
      .single()

    if (membreData) {
      // C'est un membre, pas un admin
      await supabase.auth.signOut()
      router.push('/auth/login?reason=unauthorized')
      return false
    }

    setAdminEmail(user.email || '')
    return true
  }, [router, lastActivity])

  useEffect(() => {
    checkSession().then(ok => {
      if (ok) {
        setLoading(false)
        loadAlerts()
      }
    })

    // Renouveler la vérification toutes les 5 minutes
    const interval = setInterval(checkSession, 5 * 60 * 1000)

    // Écouter l'activité utilisateur
    const updateActivity = () => setLastActivity(Date.now())
    window.addEventListener('mousemove', updateActivity)
    window.addEventListener('keypress', updateActivity)

    return () => {
      clearInterval(interval)
      window.removeEventListener('mousemove', updateActivity)
      window.removeEventListener('keypress', updateActivity)
    }
  }, [checkSession])

  const loadAlerts = async () => {
    const [m, h, c, t] = await Promise.all([
      supabase.from('memberships').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('help_requests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('is_read', false),
      supabase.from('transporteurs').select('*', { count: 'exact', head: true }).eq('statut', 'en_attente'),
    ])
    setAlerts({
      adhesions: m.count || 0,
      demandes: h.count || 0,
      messages: c.count || 0,
      transporteurs: t.count || 0,
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const getAlert = (href: string) => {
    if (href === '/admin/adhesions') return alerts.adhesions
    if (href === '/admin/demandes') return alerts.demandes
    if (href === '/admin/messages') return alerts.messages
    if (href === '/admin/transporteurs') return alerts.transporteurs
    return 0
  }

  const totalAlerts = alerts.adhesions + alerts.demandes + alerts.messages + alerts.transporteurs

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-vert border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-sm text-gray-500">Vérification de sécurité...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 admin-sidebar transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}>
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-white flex-shrink-0"><img src="https://i.ibb.co/LDtrRVPK/Whats-App-Image-2026-04-25-at-18-53-30.jpg" alt="Logo AEAB" className="w-full h-full object-contain" /></div>
            <div>
              <span className="font-heading font-bold block text-sm">AEAB Admin</span>
              <span className="text-white/40 text-xs flex items-center gap-1">
                <Shield className="w-2.5 h-2.5" /> Accès sécurisé
              </span>
            </div>
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
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${pathname === l.href ? 'bg-white/15 text-white font-semibold' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
                <span className="flex items-center gap-3">
                  <l.icon className="w-4 h-4 flex-shrink-0" />
                  {l.label}
                </span>
                {alert > 0 && (
                  <span className="bg-rouge text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                    {alert > 9 ? '9+' : alert}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-white/30 text-xs px-4 mb-2 truncate">{adminEmail}</p>
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
          <div className="ml-auto flex items-center gap-3">
            {totalAlerts > 0 && (
              <span className="text-xs bg-rouge text-white px-2.5 py-1 rounded-full font-bold">
                {totalAlerts} alerte{totalAlerts > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </header>
        <main className="p-4 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  )
}
