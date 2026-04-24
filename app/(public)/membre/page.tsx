'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  User, LogIn, UserPlus, LogOut, FileText, Calendar,
  HelpCircle, Eye, EyeOff, CheckCircle, Loader2, Edit, Save, Shield
} from 'lucide-react'

// Validation helpers
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const sanitize = (str: string) => str.replace(/<[^>]*>/g, '').trim().slice(0, 500)

export default function PortailMembrePage() {
  const [mode, setMode] = useState<'login' | 'register' | 'dashboard' | 'forgot'>('login')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [editing, setEditing] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    email: '', password: '', confirm: '', nom: '', prenom: '',
    telephone: '', etablissement: '', filiere: '', niveau: '',
    visible_annuaire: true,
  })
  const [editForm, setEditForm] = useState<any>({})
  const [forgotEmail, setForgotEmail] = useState('')

  // Vérifier session au chargement
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        loadProfile(session.user.id)
        setMode('dashboard')
      }
    })
    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        loadProfile(session.user.id)
        setMode('dashboard')
      } else {
        setUser(null)
        setProfile(null)
        setMode('login')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from('membre_accounts')
      .select('id, prenom, nom, telephone, etablissement, filiere, niveau, ville, bio, statut_adhesion, visible_annuaire')
      .eq('id', userId)
      .single()
    if (data) setProfile(data)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!isValidEmail(loginForm.email)) { setError('Email invalide.'); return }
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    })
    setLoading(false)
    if (err) {
      // Message générique pour ne pas révéler si l'email existe
      setError('Email ou mot de passe incorrect.')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!isValidEmail(registerForm.email)) { setError('Email invalide.'); return }
    if (registerForm.password !== registerForm.confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    if (registerForm.password.length < 8) { setError('Minimum 8 caractères.'); return }
    if (!/[A-Z]/.test(registerForm.password) || !/[0-9]/.test(registerForm.password)) {
      setError('Le mot de passe doit contenir au moins une majuscule et un chiffre.')
      return
    }
    setLoading(true)

    // Créer compte Supabase Auth
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: registerForm.email,
      password: registerForm.password,
      options: {
        data: { nom: sanitize(registerForm.nom), prenom: sanitize(registerForm.prenom) }
      }
    })
    if (authErr) { setError(authErr.message); setLoading(false); return }

    // Créer profil dans membre_accounts
    if (authData.user) {
      await supabase.from('membre_accounts').insert([{
        id: authData.user.id,
        email: registerForm.email,
        nom: sanitize(registerForm.nom),
        prenom: sanitize(registerForm.prenom),
        telephone: sanitize(registerForm.telephone),
        etablissement: sanitize(registerForm.etablissement),
        filiere: sanitize(registerForm.filiere),
        niveau: registerForm.niveau,
        visible_annuaire: registerForm.visible_annuaire,
        statut_adhesion: 'non_membre',
        use_supabase_auth: true,
      }])
    }
    setLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidEmail(forgotEmail)) { setError('Email invalide.'); return }
    setLoading(true)
    await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/membre`,
    })
    setLoading(false)
    setResetSent(true)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const handleSaveProfile = async () => {
    if (!user) return
    setLoading(true)
    const safe = {
      prenom: sanitize(editForm.prenom || ''),
      nom: sanitize(editForm.nom || ''),
      telephone: sanitize(editForm.telephone || ''),
      etablissement: sanitize(editForm.etablissement || ''),
      filiere: sanitize(editForm.filiere || ''),
      niveau: editForm.niveau || '',
      bio: sanitize(editForm.bio || '').slice(0, 300),
      visible_annuaire: !!editForm.visible_annuaire,
    }
    const { data } = await supabase
      .from('membre_accounts')
      .update(safe)
      .eq('id', user.id)
      .select()
      .single()
    setLoading(false)
    if (data) { setProfile(data); setEditing(false) }
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
  if (mode === 'dashboard' && user) return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-vert py-10 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-heading font-bold">
              {profile?.prenom?.[0]}{profile?.nom?.[0]}
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-white">
                Bonjour, {profile?.prenom || 'Membre'} !
              </h1>
              <p className="text-white/70 text-sm">{user.email}</p>
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
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statutColors[profile?.statut_adhesion || 'non_membre']}`}>
              {statutLabels[profile?.statut_adhesion || 'non_membre']}
            </span>
          </div>
          {profile?.statut_adhesion === 'non_membre' && (
            <a href="/adhesion" className="btn-primary text-sm">Faire une demande d&apos;adhésion →</a>
          )}
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: FileText, label: 'Mes demandes', href: '/mes-demandes', color: 'text-rouge' },
            { icon: Calendar, label: 'Événements', href: '/evenements', color: 'text-vert' },
            { icon: User, label: 'Annuaire', href: '/annuaire', color: 'text-blue-600' },
            { icon: HelpCircle, label: 'Covoiturage', href: '/covoiturage', color: 'text-orange-600' },
          ].map(item => (
            <a key={item.label} href={item.href}
              className="bg-white rounded-xl border p-4 text-center hover:-translate-y-0.5 transition-transform no-underline">
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
              <button onClick={() => { setEditForm({ ...profile }); setEditing(true) }}
                className="flex items-center gap-2 text-sm text-vert hover:underline">
                <Edit className="w-4 h-4" /> Modifier
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="text-sm text-gray-500">Annuler</button>
                <button onClick={handleSaveProfile} disabled={loading}
                  className="flex items-center gap-1 text-sm bg-vert text-white px-3 py-1.5 rounded-lg">
                  {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Sauvegarder
                </button>
              </div>
            )}
          </div>

          {!editing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Nom', value: `${profile?.prenom || ''} ${profile?.nom || ''}` },
                { label: 'Email', value: user.email },
                { label: 'Téléphone', value: profile?.telephone || '—' },
                { label: 'Établissement', value: profile?.etablissement || '—' },
                { label: 'Filière', value: profile?.filiere || '—' },
                { label: 'Niveau', value: profile?.niveau || '—' },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'prenom', label: 'Prénom', maxLength: 50 },
                { key: 'nom', label: 'Nom', maxLength: 50 },
                { key: 'telephone', label: 'Téléphone', maxLength: 20 },
                { key: 'etablissement', label: 'Établissement', maxLength: 100 },
                { key: 'filiere', label: 'Filière', maxLength: 100 },
              ].map(field => (
                <div key={field.key}>
                  <label className="form-label">{field.label}</label>
                  <input className="form-input" maxLength={field.maxLength}
                    value={editForm[field.key] || ''}
                    onChange={e => setEditForm({ ...editForm, [field.key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label className="form-label">Niveau</label>
                <select className="form-input" value={editForm.niveau || ''}
                  onChange={e => setEditForm({ ...editForm, niveau: e.target.value })}>
                  <option value="">—</option>
                  {['Licence 1','Licence 2','Licence 3','Master 1','Master 2','Doctorat','Autre'].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="form-label">Bio (max 300 caractères)</label>
                <textarea className="form-input" rows={2} maxLength={300}
                  value={editForm.bio || ''}
                  onChange={e => setEditForm({ ...editForm, bio: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={!!editForm.visible_annuaire}
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
          <p className="text-sm text-gray-500 mt-1">Accès sécurisé à votre espace personnel</p>
          <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-400">
            <Shield className="w-3 h-3" /> Connexion chiffrée SSL
          </div>
        </div>

        {mode !== 'forgot' && (
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
        )}

        <div className="card p-7">
          {error && <div className="bg-rouge-50 text-rouge text-sm p-3 rounded-lg mb-4 flex items-start gap-2">⚠️ {error}</div>}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
              <div>
                <label className="form-label">Email</label>
                <input required type="email" className="form-input" autoComplete="email"
                  value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value.toLowerCase().trim() })} />
              </div>
              <div>
                <label className="form-label">Mot de passe</label>
                <div className="relative">
                  <input required type={showPwd ? 'text' : 'password'} className="form-input pr-10"
                    autoComplete="current-password"
                    value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />} Se connecter
              </button>
              <button type="button" onClick={() => { setMode('forgot'); setError('') }}
                className="w-full text-center text-xs text-gray-400 hover:text-vert mt-1">
                Mot de passe oublié ?
              </button>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4" autoComplete="on">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="form-label">Prénom *</label>
                  <input required className="form-input" maxLength={50} value={registerForm.prenom}
                    onChange={e => setRegisterForm({ ...registerForm, prenom: e.target.value })} /></div>
                <div><label className="form-label">Nom *</label>
                  <input required className="form-input" maxLength={50} value={registerForm.nom}
                    onChange={e => setRegisterForm({ ...registerForm, nom: e.target.value })} /></div>
              </div>
              <div><label className="form-label">Email *</label>
                <input required type="email" className="form-input" autoComplete="email"
                  value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value.toLowerCase().trim() })} /></div>
              <div><label className="form-label">Établissement</label>
                <input className="form-input" maxLength={100} value={registerForm.etablissement}
                  onChange={e => setRegisterForm({ ...registerForm, etablissement: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="form-label">Filière</label>
                  <input className="form-input" maxLength={100} value={registerForm.filiere}
                    onChange={e => setRegisterForm({ ...registerForm, filiere: e.target.value })} /></div>
                <div><label className="form-label">Niveau</label>
                  <select className="form-input" value={registerForm.niveau}
                    onChange={e => setRegisterForm({ ...registerForm, niveau: e.target.value })}>
                    <option value="">—</option>
                    {['Licence 1','Licence 2','Licence 3','Master 1','Master 2','Doctorat','Autre'].map(n => <option key={n}>{n}</option>)}
                  </select></div>
              </div>
              <div><label className="form-label">Mot de passe * <span className="text-gray-400 font-normal text-xs">(8+ car., 1 maj., 1 chiffre)</span></label>
                <div className="relative">
                  <input required type={showPwd ? 'text' : 'password'} minLength={8} className="form-input pr-10"
                    autoComplete="new-password"
                    value={registerForm.password} onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div></div>
              <div><label className="form-label">Confirmer *</label>
                <input required type="password" className="form-input" autoComplete="new-password"
                  value={registerForm.confirm} onChange={e => setRegisterForm({ ...registerForm, confirm: e.target.value })} /></div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={registerForm.visible_annuaire}
                  onChange={e => setRegisterForm({ ...registerForm, visible_annuaire: e.target.checked })}
                  className="w-4 h-4 accent-vert" />
                <span className="text-xs text-gray-600">Visible dans l&apos;annuaire des membres</span>
              </label>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />} Créer mon compte
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <div>
              <button onClick={() => { setMode('login'); setError(''); setResetSent(false) }}
                className="text-sm text-gray-400 hover:text-vert mb-4 flex items-center gap-1">
                ← Retour
              </button>
              <h3 className="font-heading font-bold text-lg mb-2">Mot de passe oublié</h3>
              {resetSent ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-10 h-10 text-vert mx-auto mb-3" />
                  <p className="text-sm text-gray-600">Un email de réinitialisation a été envoyé à <strong>{forgotEmail}</strong></p>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div><label className="form-label">Votre email</label>
                    <input required type="email" className="form-input"
                      value={forgotEmail} onChange={e => setForgotEmail(e.target.value.toLowerCase().trim())} /></div>
                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Envoyer le lien de réinitialisation'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
