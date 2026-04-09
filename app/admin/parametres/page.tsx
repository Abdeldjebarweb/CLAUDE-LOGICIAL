'use client'
import { Settings } from 'lucide-react'

export default function AdminParametres() {
  return (
    <div>
      <h2 className="text-lg font-bold mb-6">Paramètres</h2>
      <div className="bg-white rounded-xl border p-8 text-center">
        <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Les paramètres du site (textes modifiables, réglages généraux) seront disponibles ici.</p>
        <p className="text-sm text-gray-400 mt-2">Cette section permet de modifier les textes des pages Accueil, À propos, Mission, Guide, etc. directement depuis l&apos;admin.</p>
      </div>
    </div>
  )
}
