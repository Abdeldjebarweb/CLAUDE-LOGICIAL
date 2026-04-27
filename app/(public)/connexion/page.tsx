'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Shield, User } from 'lucide-react'

export default function ConnexionPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Rediriger si déjà connecté
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return
      const { data: adminData } = await supabase
        .from('admin_emails').select('email')
        .eq('email', session.user.email).maybeSingle()
      if (adminData) router.push('/admin')
      else router.push('/membre')
    })
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 1. Connexion Supabase Auth
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    })

    if (authError || !data.user) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
      return
    }

    // 2. Vérifier si c'est un admin via la table admin_emails
    const { data: adminData } = await supabase
      .from('admin_emails')
      .select('email')
      .eq('email', data.user.email)
      .maybeSingle()

    if (adminData) {
      // Email trouvé dans admin_emails → admin
      router.push('/admin')
    } else {
      // Pas admin → espace membre
      router.push('/membre')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden mb-4 shadow-lg">
            <img
              src="https://i.ibb.co/LDtrRVPK/Whats-App-Image-2026-04-25-at-18-53-30.jpg"
              alt="AEAB"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Connexion AEAB</h1>
          <p className="text-sm text-gray-500 mt-1">Espace membre & administration</p>
        </div>

        {/* Badges rôles */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-vert-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-vert" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700">Membre</p>
              <p className="text-xs text-gray-400">Espace personnel</p>
            </div>
          </div>
          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-rouge-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-rouge" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700">Admin</p>
              <p className="text-xs text-gray-400">Gestion du site</p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="card p-7">
          <p className="text-xs text-gray-400 text-center mb-5">
            Entrez vos identifiants — vous serez redirigé automatiquement vers votre espace.
          </p>

          {error && (
            <div className="bg-rouge-50 border border-rouge-200 text-rouge text-sm p-3 rounded-lg mb-4">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                className="form-input"
                placeholder="votre@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="form-input pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="/membre" className="text-xs text-vert hover:underline">
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Connexion en cours...</>
                : 'Se connecter'
              }
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Pas encore membre ?{' '}
              <a href="/membre" className="text-vert font-semibold hover:underline">
                Créer un compte
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
          <Shield className="w-3 h-3" /> Connexion sécurisée SSL
        </p>
      </div>
    </div>
  )
}
