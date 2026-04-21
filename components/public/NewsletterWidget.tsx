'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Mail, CheckCircle, Loader2 } from 'lucide-react'

export default function NewsletterWidget() {
  const [email, setEmail] = useState('')
  const [nom, setNom] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email, nom, statut: 'actif' }])
    setLoading(false)
    if (err) {
      if (err.code === '23505') setError('Cet email est déjà inscrit à la newsletter.')
      else setError('Une erreur est survenue. Réessayez.')
    } else {
      setSuccess(true)
    }
  }

  if (success) return (
    <div className="flex items-center gap-3 bg-vert-50 border border-vert-200 rounded-xl px-5 py-4">
      <CheckCircle className="w-6 h-6 text-vert flex-shrink-0" />
      <div>
        <p className="font-semibold text-vert text-sm">Inscription confirmée !</p>
        <p className="text-xs text-gray-500">Vous recevrez nos prochaines actualités.</p>
      </div>
    </div>
  )

  return (
    <div className="bg-vert-800 rounded-2xl p-8 text-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-lg">Newsletter AEAB</h3>
          <p className="text-white/70 text-sm">Actualités, événements, offres d&apos;aide</p>
        </div>
      </div>
      {error && <p className="text-rouge-300 text-sm mb-3 bg-white/10 p-2 rounded-lg">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Votre prénom (optionnel)"
          className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/50"
          value={nom}
          onChange={e => setNom(e.target.value)}
        />
        <div className="flex gap-2">
          <input
            type="email"
            required
            placeholder="votre@email.com"
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:border-white/50"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button type="submit" disabled={loading}
            className="px-5 py-2.5 bg-rouge rounded-xl font-semibold text-sm hover:bg-rouge-700 transition-colors flex items-center gap-2 whitespace-nowrap">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "S'inscrire"}
          </button>
        </div>
        <p className="text-white/40 text-xs">Pas de spam. Désinscription en un clic.</p>
      </form>
    </div>
  )
}
