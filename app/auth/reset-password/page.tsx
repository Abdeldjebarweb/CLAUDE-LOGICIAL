'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    if (password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError('Erreur: ' + error.message)
    } else {
      setDone(true)
      setTimeout(() => router.push('/auth/login'), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center justify-center w-16 h-16 bg-vert-50 rounded-2xl mx-auto mb-6">
          <img src="https://i.ibb.co/LDtrRVPK/Whats-App-Image-2026-04-25-at-18-53-30.jpg" alt="AEAB" className="w-12 h-12 object-contain" />
        </div>

        {done ? (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-vert mx-auto mb-4" />
            <h2 className="font-heading font-bold text-xl mb-2">Mot de passe modifié !</h2>
            <p className="text-gray-500 text-sm">Redirection vers la connexion...</p>
          </div>
        ) : (
          <>
            <h2 className="font-heading font-bold text-2xl text-gray-900 text-center mb-2">
              Nouveau mot de passe
            </h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              Choisissez un nouveau mot de passe sécurisé.
            </p>

            {error && (
              <div className="bg-rouge-50 border border-rouge-200 text-rouge text-sm p-3 rounded-lg mb-4">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="form-label">Nouveau mot de passe</label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} required minLength={8}
                    className="form-input pr-10" placeholder="Minimum 8 caractères"
                    value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="form-label">Confirmer le mot de passe</label>
                <input type={showPwd ? 'text' : 'password'} required
                  className="form-input" placeholder="Répétez le mot de passe"
                  value={confirm} onChange={e => setConfirm(e.target.value)} />
              </div>

              {/* Indicateur force */}
              {password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${
                        password.length >= i * 3
                          ? i <= 1 ? 'bg-rouge' : i <= 2 ? 'bg-yellow-400' : i <= 3 ? 'bg-blue-400' : 'bg-vert'
                          : 'bg-gray-200'
                      }`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    {password.length < 6 ? 'Trop court' : password.length < 9 ? 'Moyen' : password.length < 12 ? 'Bon' : 'Excellent'}
                  </p>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Modification...</> : 'Changer le mot de passe'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
