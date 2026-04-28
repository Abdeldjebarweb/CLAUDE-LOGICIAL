'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'

export default function ConfirmPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleConfirm = async () => {
      // Supabase met les tokens dans le hash ou les query params
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const queryParams = new URLSearchParams(window.location.search)

      const accessToken = hashParams.get('access_token') || queryParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token')
      const type = hashParams.get('type') || queryParams.get('type')
      const tokenHash = queryParams.get('token_hash')
      const tokenType = queryParams.get('type')

      try {
        if (tokenHash) {
          // Nouveau format Supabase
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: (tokenType as any) || 'email',
          })
          if (error) throw error
        } else if (accessToken && refreshToken) {
          // Ancien format
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          if (error) throw error
        } else {
          throw new Error('Lien de confirmation invalide.')
        }

        // Récupérer l'utilisateur
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          // Mettre à jour le statut membre si nécessaire
          await supabase
            .from('membre_accounts')
            .update({ statut_adhesion: 'membre_actif' })
            .eq('id', user.id)
            .eq('statut_adhesion', 'non_membre')
        }

        setStatus('success')
        setMessage('Votre email a été confirmé avec succès !')

        // Rediriger vers l'espace membre après 3 secondes
        setTimeout(() => router.push('/membre'), 3000)

      } catch (err: any) {
        setStatus('error')
        setMessage(err.message || 'Lien invalide ou expiré.')
      }
    }

    handleConfirm()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden">
          <img src="https://i.ibb.co/LDtrRVPK/Whats-App-Image-2026-04-25-at-18-53-30.jpg" alt="AEAB" className="w-full h-full object-contain" />
        </div>

        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-vert mx-auto mb-4 animate-spin" />
            <h2 className="font-heading text-xl font-bold text-gray-900">Vérification en cours...</h2>
            <p className="text-gray-500 mt-2 text-sm">Veuillez patienter</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-vert mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold text-gray-900">Email confirmé !</h2>
            <p className="text-gray-500 mt-2">{message}</p>
            <p className="text-gray-400 text-sm mt-4">Redirection vers votre espace membre...</p>
            <div className="mt-6">
              <a href="/membre" className="btn-primary">Accéder à mon espace →</a>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-rouge mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold text-gray-900">Erreur de confirmation</h2>
            <p className="text-gray-500 mt-2">{message}</p>
            <div className="mt-6 flex gap-3 justify-center flex-wrap">
              <a href="/adhesion" className="btn-primary">Réessayer l'inscription</a>
              <a href="/membre" className="btn-outline">Se connecter</a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
