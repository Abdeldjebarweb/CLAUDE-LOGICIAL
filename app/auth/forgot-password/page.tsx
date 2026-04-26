'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    setLoading(false)
    if (error) {
      setError('Email introuvable. Vérifiez votre adresse.')
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center justify-center w-16 h-16 bg-vert-50 rounded-2xl mx-auto mb-6">
          <img src="https://i.ibb.co/LDtrRVPK/Whats-App-Image-2026-04-25-at-18-53-30.jpg" alt="AEAB" className="w-12 h-12 object-contain" />
        </div>

        {sent ? (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-vert mx-auto mb-4" />
            <h2 className="font-heading font-bold text-xl text-gray-900 mb-2">Email envoyé !</h2>
            <p className="text-gray-500 text-sm mb-6">
              Un lien de réinitialisation a été envoyé à <strong>{email}</strong>. 
              Vérifiez vos emails (et vos spams).
            </p>
            <Link href="/auth/login" className="btn-primary text-sm">
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            <h2 className="font-heading font-bold text-2xl text-gray-900 text-center mb-2">
              Mot de passe oublié
            </h2>
            <p className="text-gray-500 text-sm text-center mb-6">
              Entrez votre email admin et nous vous enverrons un lien de réinitialisation.
            </p>

            {error && (
              <div className="bg-rouge-50 border border-rouge-200 text-rouge text-sm p-3 rounded-lg mb-4">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="form-label">Email admin</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" required className="form-input pl-10"
                    placeholder="votre@email.com"
                    value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi...</> : 'Envoyer le lien'}
              </button>
            </form>

            <Link href="/auth/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-vert mt-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Retour à la connexion
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
