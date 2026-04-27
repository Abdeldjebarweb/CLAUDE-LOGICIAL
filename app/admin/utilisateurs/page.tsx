'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Shield, ShieldOff, Search, Loader2, UserCheck, UserX, User, X } from 'lucide-react'

export default function AdminUtilisateurs() {
  const [membres, setMembres] = useState<any[]>([])
  const [admins, setAdmins] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selected, setSelected] = useState<any>(null)

  const load = async () => {
    setLoading(true)
    const [{ data: m }, { data: a }] = await Promise.all([
      supabase.from('membre_accounts')
        .select('id, prenom, nom, email, telephone, etablissement, filiere, niveau, ville, bio, statut_adhesion, visible_annuaire, avatar_url, created_at')
        .order('created_at', { ascending: false }),
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

      {/* Modal détails membre */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <h3 className="font-heading font-bold text-lg">Détails du membre</h3>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            {/* Photo + nom */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-vert-100 overflow-hidden flex-shrink-0 border-2 border-vert-200">
                {selected.avatar_url
                  ? <img src={selected.avatar_url} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-vert text-2xl font-bold">
                      {selected.prenom?.[0]}{selected.nom?.[0]}
                    </div>
                }
              </div>
              <div>
                <p className="font-heading font-bold text-xl">{selected.prenom} {selected.nom}</p>
                <p className="text-gray-500 text-sm">{selected.email}</p>
                <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  selected.statut_adhesion === 'membre_actif' ? 'bg-vert-50 text-vert' : 'bg-gray-100 text-gray-500'
                }`}>
                  {selected.statut_adhesion === 'membre_actif' ? '✅ Membre actif' : '⚪ Non membre'}
                </span>
              </div>
            </div>

            {/* Infos */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Téléphone', value: selected.telephone },
                { label: 'Ville', value: selected.ville },
                { label: 'Établissement', value: selected.etablissement },
                { label: 'Filière', value: selected.filiere },
                { label: 'Niveau', value: selected.niveau },
                { label: 'Visible annuaire', value: selected.visible_annuaire ? 'Oui' : 'Non' },
                { label: "Date d'inscription", value: selected.created_at ? new Date(selected.created_at).toLocaleDateString('fr-FR') : '—' },
                { label: 'Admin', value: admins.includes(selected.email) ? '✅ Oui' : '❌ Non' },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-0.5">{item.label}</p>
                  <p className="font-medium">{item.value || '—'}</p>
                </div>
              ))}
            </div>

            {selected.bio && (
              <div className="mt-3 bg-gray-50 rounded-lg p-3 text-sm">
                <p className="text-gray-400 text-xs mb-1">Bio</p>
                <p>{selected.bio}</p>
              </div>
            )}

            {/* Actions dans la modal */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => { toggleStatut(selected.id, selected.statut_adhesion); setSelected(null) }}
                className={`flex-1 text-sm py-2 rounded-lg font-semibold ${
                  selected.statut_adhesion === 'membre_actif'
                    ? 'bg-rouge-50 text-rouge hover:bg-rouge hover:text-white'
                    : 'bg-vert-50 text-vert hover:bg-vert hover:text-white'
                } transition-colors`}
              >
                {selected.statut_adhesion === 'membre_actif' ? 'Désactiver' : 'Activer'}
              </button>
              <button
                onClick={() => { toggleAdmin(selected.email, admins.includes(selected.email)); setSelected(null) }}
                className={`flex-1 text-sm py-2 rounded-lg font-semibold transition-colors ${
                  admins.includes(selected.email)
                    ? 'bg-rouge-50 text-rouge hover:bg-rouge hover:text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-vert-50 hover:text-vert'
                }`}
              >
                {admins.includes(selected.email) ? 'Retirer admin' : 'Rendre admin'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-vert border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(m => {
            const isAdmin = admins.includes(m.email)
            const isLoading = actionLoading === m.email || actionLoading === m.id
            return (
              <div key={m.id}
                onClick={() => setSelected(m)}
                className="card p-4 cursor-pointer hover:-translate-y-0.5 transition-all hover:shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-vert-100 overflow-hidden flex-shrink-0">
                    {m.avatar_url
                      ? <img src={m.avatar_url} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-vert text-lg font-bold">
                          {m.prenom?.[0]}{m.nom?.[0]}
                        </div>
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{m.prenom} {m.nom}</p>
                    <p className="text-xs text-gray-400 truncate">{m.email}</p>
                  </div>
                  {isAdmin && <Shield className="w-4 h-4 text-vert flex-shrink-0 ml-auto" />}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                  <span>🏫 {m.etablissement || '—'}</span>
                  <span>📚 {m.filiere || '—'}</span>
                  <span>🎓 {m.niveau || '—'}</span>
                  <span>📅 {m.created_at ? new Date(m.created_at).toLocaleDateString('fr-FR') : '—'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    m.statut_adhesion === 'membre_actif' ? 'bg-vert-50 text-vert' :
                    m.statut_adhesion === 'en_attente' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {m.statut_adhesion === 'membre_actif' ? '✅ Actif' : m.statut_adhesion === 'en_attente' ? '⏳ En attente' : '⚪ Inactif'}
                  </span>
                  <span className="text-xs text-vert">Voir détails →</span>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-10 text-gray-400">Aucun utilisateur trouvé.</div>
          )}
        </div>
      )}
    </div>
  )
}
