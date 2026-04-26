'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Loader2, Lock } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-vert flex items-center justify-center text-white text-2xl mb-4">☪</div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Espace admin AEAB</h1>
          <p className="text-sm text-gray-500 mt-1">Connectez-vous pour gérer le site</p>
        </div>
        <form onSubmit={handleLogin} className="card p-8 space-y-5">
          {error && <div className="bg-rouge-50 text-rouge text-sm p-3 rounded-lg">{error}</div>}
          <div>
            <label className="form-label">Email</label>
            <input type="email" required className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Mot de passe</label>
            <input type="password" required className="form-input" value={password} onChange={e => setPassword(e.target.value)} />
            <div className="text-right mt-1">
              <a href="/auth/forgot-password" className="text-xs text-vert hover:underline">Mot de passe oublié ?</a>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-4 h-4" />}
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
