'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User, LogIn, UserPlus, LogOut, FileText, Calendar, HelpCircle, Eye, EyeOff, CheckCircle, Loader2, Edit, Save } from 'lucide-react'

export default function PortailMembrePage() {
  const [mode, setMode] = useState<'login' | 'register' | 'dashboard'>('login')
  const [membre, setMembre] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [editing, setEditing] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    email: '', password: '', confirm: '', nom: '', prenom: '',
    telephone: '', etablissement: '', filiere: '', niveau: '',
    visible_annuaire: true,
  })
  const [editForm, setEditForm] = useState<any>({})

  // Charger le membre depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aeab_membre')
    if (saved) {
      setMembre(JSON.parse(saved))
      setMode('dashboard')
    }
  }, [])

  const hashPassword = (pwd: string) => {
    // Simple hash pour demo - en prod utiliser bcrypt
    return btoa(pwd + 'aeab_salt_2024')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const hash = hashPassword(loginForm.password)
    const { data, error: err } = await supabase
      .from('membre_accounts')
      .select('*')
      .eq('email', loginForm.email)
      .eq('mot_de_passe_hash', hash)
      .single()
    setLoading(false)
    if (err || !data) {
      setError('Email ou mot de passe incorrect.')
    } else {
      // Update last login
      await supabase.from('membre_accounts').update({ last_login: new Date().toISOString() }).eq('id', data.id)
      localStorage.setItem('aeab_membre', JSON.stringify(data))
      setMembre(data)
      setMode('dashboard')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (registerForm.password !== registerForm.confirm) {
      setError('Les mots de passe ne correspondent pas.')
      setLoading(false)
      return
    }
    if (registerForm.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      setLoading(false)
      return
    }
    const { data, error: err } = await supabase.from('membre_accounts').insert([{
      email: registerForm.email,
      mot_de_passe_hash: hashPassword(registerForm.password),
      nom: registerForm.nom,
      prenom: registerForm.prenom,
      telephone: registerForm.telephone,
      etablissement: registerForm.etablissement,
      filiere: registerForm.filiere,
      niveau: registerForm.niveau,
      visible_annuaire: registerForm.visible_annuaire,
      statut_adhesion: 'non_membre',
    }]).select().single()
    setLoading(false)
    if (err) {
      if (err.code === '23505') setError('Cet email est déjà enregistré.')
      else setError('Erreur lors de la création du compte.')
    } else {
      localStorage.setItem('aeab_membre', JSON.stringify(data))
      setMembre(data)
      setMode('dashboard')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('aeab_membre')
    setMembre(null)
    setMode('login')
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('membre_accounts')
      .update(editForm)
      .eq('id', membre.id)
      .select()
      .single()
    setLoading(false)
    if (!err && data) {
      localStorage.setItem('aeab_membre', JSON.stringify(data))
      setMembre(data)
      setEditing(false)
    }
  }

  const statutColors: Record<string, string> = {
    non_membre: 'bg-gray-100 text-gray-600',
    en_attente: 'bg-yellow-50 text-yellow-700',
    membre_actif: 'bg-vert-50 text-vert',
  }
  const statutLabels: Record<string, string> = {
    non_membre: '⚪ Non membre',
    en_attente: '⏳ En attente',
    membre_actif: '✅ Membre actif',
  }

  // Dashboard
  if (mode === 'dashboard' && membre) return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-vert py-10 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-heading font-bold">
              {membre.prenom?.[0]}{membre.nom?.[0]}
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-white">Bonjour, {membre.prenom} !</h1>
              <p className="text-white/70 text-sm">{membre.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Statut adhésion */}
        <div className="bg-white rounded-xl border p-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Statut d&apos;adhésion</p>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statutColors[membre.statut_adhesion]}`}>
              {statutLabels[membre.statut_adhesion]}
            </span>
          </div>
          {membre.statut_adhesion === 'non_membre' && (
            <a href="/adhesion" className="btn-primary text-sm">Faire une demande d&apos;adhésion →</a>
          )}
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: FileText, label: 'Mes demandes', href: '/aide', color: 'text-rouge' },
            { icon: Calendar, label: 'Événements', href: '/evenements', color: 'text-vert' },
            { icon: User, label: 'Annuaire', href: '/annuaire', color: 'text-blue-600' },
            { icon: HelpCircle, label: 'Covoiturage', href: '/covoiturage', color: 'text-orange-600' },
          ].map(item => (
            <a key={item.label} href={item.href}
              className="bg-white rounded-xl border p-4 text-center hover:-translate-y-0.5 transition-transform no-underline group">
              <item.icon className={`w-7 h-7 mx-auto mb-2 ${item.color}`} />
              <p className="text-xs font-semibold text-gray-700">{item.label}</p>
            </a>
          ))}
        </div>

        {/* Profil */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-lg">Mon profil</h2>
            {!editing ? (
              <button onClick={() => { setEditForm({ ...membre }); setEditing(true) }}
                className="flex items-center gap-2 text-sm text-vert hover:underline">
                <Edit className="w-4 h-4" /> Modifier
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="text-sm text-gray-500 hover:underline">Annuler</button>
                <button onClick={handleSaveProfile} disabled={loading}
                  className="flex items-center gap-1 text-sm bg-vert text-white px-3 py-1.5 rounded-lg">
                  {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Sauvegarder
                </button>
              </div>
            )}
          </div>

          {!editing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {[
                { label: 'Nom', value: `${membre.prenom} ${membre.nom}` },
                { label: 'Email', value: membre.email },
                { label: 'Téléphone', value: membre.telephone || '—' },
                { label: 'Établissement', value: membre.etablissement || '—' },
                { label: 'Filière', value: membre.filiere || '—' },
                { label: 'Niveau', value: membre.niveau || '—' },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
              <div className="col-span-2 flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Visible dans l&apos;annuaire</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${membre.visible_annuaire ? 'bg-vert-50 text-vert' : 'bg-gray-100 text-gray-500'}`}>
                  {membre.visible_annuaire ? 'Oui' : 'Non'}
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'prenom', label: 'Prénom', type: 'text' },
                { key: 'nom', label: 'Nom', type: 'text' },
                { key: 'telephone', label: 'Téléphone', type: 'tel' },
                { key: 'etablissement', label: 'Établissement', type: 'text' },
                { key: 'filiere', label: 'Filière', type: 'text' },
                { key: 'niveau', label: 'Niveau', type: 'text' },
              ].map(field => (
                <div key={field.key}>
                  <label className="form-label">{field.label}</label>
                  <input type={field.type} className="form-input"
                    value={editForm[field.key] || ''}
                    onChange={e => setEditForm({ ...editForm, [field.key]: e.target.value })} />
                </div>
              ))}
              <div className="col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={editForm.visible_annuaire}
                    onChange={e => setEditForm({ ...editForm, visible_annuaire: e.target.checked })}
                    className="w-4 h-4 accent-vert" />
                  <span className="text-sm text-gray-700">Visible dans l&apos;annuaire des membres</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-vert flex items-center justify-center text-white text-2xl mb-4">☪</div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Espace membre AEAB</h1>
          <p className="text-sm text-gray-500 mt-1">Accédez à votre espace personnel</p>
        </div>

        {/* Onglets */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
          <button onClick={() => { setMode('login'); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'login' ? 'bg-white shadow text-vert' : 'text-gray-500'}`}>
            <LogIn className="w-4 h-4 inline mr-1" /> Connexion
          </button>
          <button onClick={() => { setMode('register'); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'register' ? 'bg-white shadow text-vert' : 'text-gray-500'}`}>
            <UserPlus className="w-4 h-4 inline mr-1" /> Créer un compte
          </button>
        </div>

        <div className="card p-7">
          {error && <div className="bg-rouge-50 text-rouge text-sm p-3 rounded-lg mb-4">{error}</div>}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="form-label">Email</label>
                <input required type="email" className="form-input" value={loginForm.email}
                  onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Mot de passe</label>
                <div className="relative">
                  <input required type={showPwd ? 'text' : 'password'} className="form-input pr-10"
                    value={loginForm.password}
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                Se connecter
              </button>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="form-label">Prénom *</label><input required className="form-input" value={registerForm.prenom} onChange={e => setRegisterForm({ ...registerForm, prenom: e.target.value })} /></div>
                <div><label className="form-label">Nom *</label><input required className="form-input" value={registerForm.nom} onChange={e => setRegisterForm({ ...registerForm, nom: e.target.value })} /></div>
              </div>
              <div><label className="form-label">Email *</label><input required type="email" className="form-input" value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })} /></div>
              <div><label className="form-label">Établissement</label><input className="form-input" placeholder="Ex: Université de Bordeaux" value={registerForm.etablissement} onChange={e => setRegisterForm({ ...registerForm, etablissement: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="form-label">Filière</label><input className="form-input" value={registerForm.filiere} onChange={e => setRegisterForm({ ...registerForm, filiere: e.target.value })} /></div>
                <div>
                  <label className="form-label">Niveau</label>
                  <select className="form-input" value={registerForm.niveau} onChange={e => setRegisterForm({ ...registerForm, niveau: e.target.value })}>
                    <option value="">—</option>
                    {['Licence 1','Licence 2','Licence 3','Master 1','Master 2','Doctorat','Autre'].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Mot de passe *</label>
                <div className="relative">
                  <input required type={showPwd ? 'text' : 'password'} minLength={8} className="form-input pr-10"
                    placeholder="Minimum 8 caractères"
                    value={registerForm.password}
                    onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div><label className="form-label">Confirmer *</label><input required type="password" className="form-input" value={registerForm.confirm} onChange={e => setRegisterForm({ ...registerForm, confirm: e.target.value })} /></div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={registerForm.visible_annuaire}
                  onChange={e => setRegisterForm({ ...registerForm, visible_annuaire: e.target.checked })}
                  className="w-4 h-4 accent-vert" />
                <span className="text-xs text-gray-600">Visible dans l&apos;annuaire des membres</span>
              </label>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                Créer mon compte
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
