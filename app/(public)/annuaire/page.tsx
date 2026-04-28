'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, Lock, Clock } from 'lucide-react'

export default function AnnuairePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session?.user)
      setCheckingAuth(false)
    })
  }, [])

  if (checkingAuth) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-vert border-t-transparent rounded-full" />
    </div>
  )

  if (!isLoggedIn) return (
    <div className="min-h-screen bg-gray-50">
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-white">Annuaire des membres</h1>
          <p className="text-white/80 mt-4">Retrouvez les étudiants algériens de Bordeaux</p>
        </div>
      </section>
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-gray-900 mb-3">Membres uniquement</h2>
        <p className="text-gray-500 mb-6">Connectez-vous pour accéder à l&apos;annuaire.</p>
        <a href="/connexion" className="btn-primary">Se connecter</a>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-white">Annuaire des membres</h1>
          <p className="text-white/80 mt-4">Retrouvez les étudiants algériens de Bordeaux</p>
        </div>
      </section>

      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-vert-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-12 h-12 text-vert" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-gray-900 mb-3">Bientôt disponible</h2>
        <p className="text-gray-500 mb-2">L&apos;annuaire des membres sera disponible prochainement.</p>
        <p className="text-gray-400 text-sm">En attendant, retrouvez-nous sur nos réseaux sociaux ou contactez-nous directement.</p>
        <div className="flex gap-3 justify-center mt-8 flex-wrap">
          <a href="/evenements" className="btn-primary">Voir les événements</a>
          <a href="/contact" className="btn-outline">Nous contacter</a>
        </div>
      </div>
    </div>
  )
}
