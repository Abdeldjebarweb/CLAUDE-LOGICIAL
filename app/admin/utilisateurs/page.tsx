'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Shield, ShieldOff, Search, Loader2, UserCheck, UserX } from 'lucide-react'

export default function AdminUtilisateurs() {
  const [membres, setMembres] = useState<any[]>([])
  const [admins, setAdmins] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const [{ data: m }, { data: a }] = await Promise.all([
      supabase.from('membre_accounts').select('id, prenom, nom, email, statut_adhesion, created_at').order('created_at', { ascending: false }),
      supabase.from('admin_emails').select('email'),
    ])
    setMembres(m || [])
    setAdmins((a || []).map((x: any) => x.email))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggleAdmin = async (email: string, isAdmin: boolean) => {
    if (!confirm(isAdmin ? `Retirer les droits admin à ${email} ?` : `Donner les droits admin à ${email} ?`)) return
    setActionLoading(email)
    if (isAdmin) {
      await supabase.from('admin_emails').delete().eq('email', email)
    } else {
      await supabase.from('admin_emails').insert([{ email }])
    }
    await load()
    setActionLoading(null)
  }

  const toggleStatut = async (id: string, current: string) => {
    const next = current === 'membre_actif' ? 'non_membre' : 'membre_actif'
    if (!confirm(`Changer le statut vers "${next}" ?`)) return
    setActionLoading(id)
    await supabase.from('membre_accounts').update({ statut_adhesion: next }).eq('id', id)
    await load()
    setActionLoading(null)
  }

  const filtered = membres.filter(m => {
    const q = search.toLowerCase()
    return !q || `${m.prenom} ${m.nom} ${m.email}`.toLowerCase().includes(q)
  })

  const statutColors: Record<string, string> = {
    membre_actif: 'bg-vert-50 text-vert',
    en_attente: 'bg-yellow-50 text-yellow-700',
    non_membre: 'bg-gray-100 text-gray-500',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Utilisateurs</h1>
          <p className="text-gray-500 text-sm mt-1">{membres.length} membres inscrits · {admins.length} admin(s)</p>
        </div>
      </div>

      {/* Admins actuels */}
      <div className="card p-5 mb-6">
        <h2 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-vert" /> Administrateurs actuels
        </h2>
        <div className="flex flex-wrap gap-2">
          {admins.map(email => (
            <span key={email} className="flex items-center gap-1.5 bg-vert-50 text-vert text-xs px-3 py-1.5 rounded-full font-medium">
              <Shield className="w-3 h-3" /> {email}
            </span>
          ))}
        </div>
      </div>

      {/* Recherche */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input className="form-input pl-9" placeholder="Rechercher par nom ou email..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-vert border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-600">Membre</th>
                <th className="text-left p-4 font-semibold text-gray-600">Email</th>
                <th className="text-left p-4 font-semibold text-gray-600">Statut</th>
                <th className="text-left p-4 font-semibold text-gray-600">Admin</th>
                <th className="text-left p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => {
                const isAdmin = admins.includes(m.email)
                const isLoading = actionLoading === m.email || actionLoading === m.id
                return (
                  <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-vert-100 flex items-center justify-center text-vert text-xs font-bold flex-shrink-0">
                          {m.prenom?.[0]}{m.nom?.[0]}
                        </div>
                        <span className="font-medium">{m.prenom} {m.nom}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500">{m.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statutColors[m.statut_adhesion] || 'bg-gray-100 text-gray-500'}`}>
                        {m.statut_adhesion === 'membre_actif' ? '✅ Actif' : m.statut_adhesion === 'en_attente' ? '⏳ En attente' : '⚪ Non membre'}
                      </span>
                    </td>
                    <td className="p-4">
                      {isAdmin ? (
                        <span className="flex items-center gap-1 text-xs text-vert font-medium">
                          <Shield className="w-3 h-3" /> Admin
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {/* Toggle statut */}
                        <button
                          onClick={() => toggleStatut(m.id, m.statut_adhesion)}
                          disabled={!!isLoading}
                          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                            m.statut_adhesion === 'membre_actif'
                              ? 'bg-gray-100 text-gray-600 hover:bg-rouge-50 hover:text-rouge'
                              : 'bg-vert-50 text-vert hover:bg-vert hover:text-white'
                          }`}
                        >
                          {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : m.statut_adhesion === 'membre_actif' ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                          {m.statut_adhesion === 'membre_actif' ? 'Désactiver' : 'Activer'}
                        </button>
                        {/* Toggle admin */}
                        <button
                          onClick={() => toggleAdmin(m.email, isAdmin)}
                          disabled={!!isLoading}
                          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                            isAdmin
                              ? 'bg-rouge-50 text-rouge hover:bg-rouge hover:text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-vert-50 hover:text-vert'
                          }`}
                        >
                          {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : isAdmin ? <ShieldOff className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                          {isAdmin ? 'Retirer admin' : 'Rendre admin'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400">Aucun utilisateur trouvé.</div>
          )}
        </div>
      )}
    </div>
  )
}
