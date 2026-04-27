'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import {
  User, LogIn, UserPlus, LogOut, FileText, Calendar,
  Car, Eye, EyeOff, CheckCircle, Loader2, Edit, Save, Shield, Camera, X
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
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    email: '', password: '', confirm: '', nom: '', prenom: '',
    telephone: '', etablissement: '', filiere: '', niveau: '',
    visible_annuaire: true,
  })
  const [editForm, setEditForm] = useState<any>({})
  const [forgotEmail, setForgotEmail] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        loadProfile(session.user.id)
        setMode('dashboard')
      }
    })
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
      .select('id, prenom, nom, telephone, etablissement, filiere, niveau, ville, bio, statut_adhesion, visible_annuaire, avatar_url')
      .eq('id', userId)
      .single()
    if (data) setProfile(data)
  }

  // Upload photo de profil
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) {
      console.log('Pas de fichier ou pas de user:', { file, user })
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('La photo ne doit pas dépasser 2 Mo.')
      return
    }

    setUploadingPhoto(true)
    setError('')

    const ext = file.name.split('.').pop()
    const filePath = `${user.id}/avatar.${ext}`
    console.log('Upload vers:', filePath)

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    console.log('Résultat upload:', uploadError)

    if (uploadError) {
      setError('Erreur upload: ' + uploadError.message)
      setUploadingPhoto(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    console.log('URL publique:', publicUrl)

    const { data, error: dbError } = await supabase
      .from('membre_accounts')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)
      .select()
      .single()

    console.log('Résultat DB:', { data, dbError })

    if (dbError) setError('Erreur DB: ' + dbError.message)
    if (data) setProfile(data)
    setUploadingPhoto(false)
  }

  // Supprimer la photo
  const handleRemovePhoto = async () => {
    if (!user || !profile?.avatar_url) return
    setUploadingPhoto(true)

    const oldPath = profile.avatar_url.split('/avatars/')[1]
    if (oldPath) await supabase.storage.from('avatars').remove([oldPath])

    const { data } = await supabase
      .from('membre_accounts')
      .update({ avatar_url: null })
      .eq('id', user.id)
      .select()
      .single()

    if (data) setProfile(data)
    setUploadingPhoto(false)
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
    if (err) setError('Email ou mot de passe incorrect.')
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

    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: registerForm.email,
      password: registerForm.password,
      options: {
        data: { nom: sanitize(registerForm.nom), prenom: sanitize(registerForm.prenom) }
      }
    })
    if (authErr) { setError(authErr.message); setLoading(false); return }

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
      {/* Header */}
      <div className="bg-vert py-10 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar avec bouton upload */}
            <div className="relative group">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-heading font-bold overflow-hidden border-2 border-white/30">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Photo de profil" className="w-full h-full object-cover" />
                ) : (
                  <span>{profile?.prenom?.[0]}{profile?.nom?.[0]}</span>
                )}
              </div>
              {/* Overlay upload au hover */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                {uploadingPhoto
                  ? <Loader2 className="w-5 h-5 text-white animate-spin" />
                  : <Camera className="w-5 h-5 text-white" />
                }
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
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
        {error && (
          <div className="bg-rouge-50 border border-rouge-200 text-rouge text-sm p-3 rounded-lg">
            ⚠️ {error}
          </div>
        )}

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
            { icon: Car, label: 'Covoiturage', href: '/covoiturage', color: 'text-orange-600' },
          ].map(item => (
            <a key={item.label} href={item.href}
              className="bg-white rounded-xl border p-4 text-center hover:-translate-y-0.5 transition-transform no-underline">
              <item.icon className={`w-7 h-7 mx-auto mb-2 ${item.color}`} />
              <p className="text-xs font-semibold text-gray-700">{item.label}</p>
            </a>
          ))}
        </div>

        {/* Carte membre */}
        <div className="bg-vert-50 border border-vert-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm text-vert">🪪 Carte de membre</p>
            <p className="text-xs text-gray-500 mt-0.5">Téléchargez votre carte membre officielle en PDF</p>
          </div>
          <button onClick={() => {
            const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{margin:0;padding:30px;font-family:Arial;}
            .card{width:350px;height:200px;background:linear-gradient(135deg,#1a5c38,#0d3d24);border-radius:12px;padding:20px;color:white;display:flex;flex-direction:column;justify-content:space-between;}
            .title{font-size:10px;letter-spacing:2px;opacity:0.8;}
            .name{font-size:22px;font-weight:bold;margin-top:8px;}
            .email{font-size:10px;opacity:0.7;margin-top:2px;}
            .bottom{display:flex;justify-content:space-between;align-items:flex-end;}
            .badge{background:rgba(255,255,255,0.2);padding:4px 10px;border-radius:20px;font-size:10px;}
            @media print{body{padding:0;}}</style></head>
            <body><div class="card">
            <div><div class="title">AEAB — Association des Étudiants Algériens de Bordeaux</div>
            <div class="name">${profile?.prenom || ''} ${profile?.nom || ''}</div>
            <div class="email">${user?.email || ''}</div></div>
            <div class="bottom">
            <div class="badge">✅ Membre actif ${new Date().getFullYear()}</div>
            <div style="font-size:9px;opacity:0.7">Expire: 31/08/${new Date().getFullYear() + 1}</div>
            </div></div></body></html>`
            const w = window.open('', '_blank')
            if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 500) }
          }}
            className="flex items-center gap-2 text-sm bg-vert text-white px-4 py-2 rounded-lg font-semibold hover:bg-vert-700 transition-colors flex-shrink-0">
            🪪 Télécharger
          </button>
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

          {/* Photo de profil dans la section profil */}
          {!editing && (
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Photo de profil" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {uploadingPhoto ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
                </button>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">{profile?.prenom} {profile?.nom}</p>
                <div className="flex gap-2 mt-1.5">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="text-xs text-vert hover:underline flex items-center gap-1"
                  >
                    <Camera className="w-3 h-3" />
                    {profile?.avatar_url ? 'Changer la photo' : 'Ajouter une photo'}
                  </button>
                  {profile?.avatar_url && (
                    <button
                      onClick={handleRemovePhoto}
                      disabled={uploadingPhoto}
                      className="text-xs text-rouge hover:underline flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Supprimer
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">JPG, PNG · max 2 Mo</p>
              </div>
            </div>
          )}

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
              {profile?.bio && (
                <div className="col-span-2 py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-xs block mb-1">Bio</span>
                  <p className="text-sm">{profile.bio}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Photo upload en mode édition */}
              <div className="col-span-2">
                <label className="form-label">Photo de profil</label>
                <div className="flex items-center gap-4 mt-1">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200 flex-shrink-0">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="text-sm border border-vert text-vert px-3 py-1.5 rounded-lg hover:bg-vert-50 flex items-center gap-1.5 transition-colors"
                    >
                      {uploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                      {profile?.avatar_url ? 'Changer' : 'Ajouter une photo'}
                    </button>
                    {profile?.avatar_url && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        disabled={uploadingPhoto}
                        className="text-sm border border-gray-200 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-1.5"
                      >
                        <X className="w-4 h-4" /> Supprimer
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">JPG, PNG · max 2 Mo</p>
              </div>

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
                  {['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2', 'Doctorat', 'Autre'].map(n => <option key={n}>{n}</option>)}
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
                    {['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2', 'Doctorat', 'Autre'].map(n => <option key={n}>{n}</option>)}
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
