'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, UserPlus, Shield, ShieldOff, Mail, Loader2, CheckCircle, X, Trash2 } from 'lucide-react'

export default function AdminUtilisateurs() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const load = async () => {
    // Charger les membres avec leur rôle
    const { data } = await supabase
      .from('membre_accounts')
      .select('id, prenom, nom, email, role, statut_adhesion, created_at, last_login')
      .order('created_at', { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const changeRole = async (id: string, role: string) => {
    await supabase.from('membre_accounts').update({ role }).eq('id', id)
    load()
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.includes('@')) { setError('Email invalide'); return }
    setInviting(true)
    setError('')

    // Inviter via Supabase Auth
    const { error: err } = await supabase.auth.admin?.inviteUserByEmail(inviteEmail) || {}

    if (err) {
      // Si pas d'accès admin, créer directement dans membre_accounts
      const { error: err2 } = await supabase.from('membre_accounts').insert([{
        email: inviteEmail,
        role: 'admin',
        statut_adhesion: 'membre_actif',
        visible_annuaire: false,
      }])
      if (err2) { setError('Erreur: ' + err2.message); setInviting(false); return }
    }

    setSuccess(`Invitation envoyée à ${inviteEmail}`)
    setInviteEmail('')
    setInviting(false)
    setTimeout(() => setSuccess(''), 4000)
    load()
  }

  const roleColors: Record<string, string> = {
    admin: 'bg-rouge-50 text-rouge',
    bureau: 'bg-purple-50 text-purple-700',
    benevole: 'bg-vert-50 text-vert',
    membre: 'bg-gray-100 text-gray-600',
  }
  const roleLabels: Record<string, string> = {
    admin: '🔴 Admin',
    bureau: '🟣 Bureau',
    benevole: '🟢 Bénévole',
    membre: '⚪ Membre',
  }

  const admins = users.filter(u => u.role === 'admin')
  const autres = users.filter(u => u.role !== 'admin')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Gestion des utilisateurs</h2>
          <p className="text-sm text-gray-500">{users.length} compte(s) membre</p>
        </div>
      </div>

      {/* Inviter un admin */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-heading font-bold text-base mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-vert" /> Inviter un nouvel admin
        </h3>
        {success && (
          <div className="flex items-center gap-2 bg-vert-50 border border-vert-200 rounded-lg p-3 mb-4 text-sm text-vert">
            <CheckCircle className="w-4 h-4" /> {success}
          </div>
        )}
        {error && (
          <div className="text-sm text-rouge bg-rouge-50 p-3 rounded-lg mb-4">⚠️ {error}</div>
        )}
        <form onSubmit={handleInvite} className="flex gap-3">
          <input type="email" required className="form-input flex-1"
            placeholder="email@exemple.com"
            value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
          <button type="submit" disabled={inviting} className="btn-primary flex items-center gap-2 whitespace-nowrap">
            {inviting ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi...</> : <><Mail className="w-4 h-4" /> Inviter</>}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2">
          La personne recevra un email pour créer son compte et aura accès à l&apos;admin.
        </p>
      </div>

      {/* Admins actuels */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-heading font-bold text-base mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-rouge" /> Administrateurs ({admins.length})
        </h3>
        {admins.length > 0 ? (
          <div className="space-y-3">
            {admins.map(u => (
              <div key={u.id} className="flex items-center justify-between gap-3 p-3 bg-rouge-50/30 border border-rouge-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-rouge text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {u.prenom?.[0] || u.email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{u.prenom} {u.nom}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                    {u.last_login && <p className="text-xs text-gray-400">Dernière connexion : {new Date(u.last_login).toLocaleDateString('fr-FR')}</p>}
                  </div>
                </div>
                <button onClick={() => {
                  if (confirm(`Rétrograder ${u.email} en membre simple ?`)) changeRole(u.id, 'membre')
                }} className="text-xs text-gray-400 hover:text-rouge flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rouge-50">
                  <ShieldOff className="w-3.5 h-3.5" /> Rétrograder
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Aucun admin pour le moment.</p>
        )}
      </div>

      {/* Tous les membres */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-heading font-bold text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-vert" /> Tous les membres ({users.length})
          </h3>
        </div>
        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin w-6 h-6 border-4 border-vert border-t-transparent rounded-full" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Membre</th>
                  <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Rôle actuel</th>
                  <th className="px-4 py-3 text-right font-semibold">Changer rôle</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-vert-100 flex items-center justify-center text-vert text-xs font-bold flex-shrink-0">
                          {u.prenom?.[0] || u.email[0].toUpperCase()}
                        </div>
                        <span className="font-medium">{u.prenom} {u.nom || ''}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell text-xs">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${roleColors[u.role] || 'bg-gray-100 text-gray-500'}`}>
                        {roleLabels[u.role] || u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <select
                        value={u.role || 'membre'}
                        onChange={e => changeRole(u.id, e.target.value)}
                        className="text-xs border rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-vert">
                        <option value="membre">⚪ Membre</option>
                        <option value="benevole">🟢 Bénévole</option>
                        <option value="bureau">🟣 Bureau</option>
                        <option value="admin">🔴 Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Aucun membre inscrit</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
