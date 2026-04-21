'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Lock, Save, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react'

export default function AdminParametres() {
  const [pwdForm, setPwdForm] = useState({ current: '', new: '', confirm: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdSuccess, setPwdSuccess] = useState(false)
  const [pwdError, setPwdError] = useState('')

  const handleChangePwd = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwdError('')
    if (pwdForm.new !== pwdForm.confirm) { setPwdError('Les mots de passe ne correspondent pas.'); return }
    if (pwdForm.new.length < 8) { setPwdError('Le mot de passe doit contenir au moins 8 caractères.'); return }
    setPwdLoading(true)
    const { error } = await supabase.auth.updateUser({ password: pwdForm.new })
    setPwdLoading(false)
    if (error) setPwdError('Erreur : ' + error.message)
    else { setPwdSuccess(true); setPwdForm({ current: '', new: '', confirm: '' }); setTimeout(() => setPwdSuccess(false), 3000) }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h2 className="text-lg font-bold">Paramètres du compte</h2>

      {/* Changer mot de passe */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-vert-50 flex items-center justify-center">
            <Lock className="w-5 h-5 text-vert" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg">Changer le mot de passe</h3>
            <p className="text-xs text-gray-500">Choisissez un mot de passe sécurisé d&apos;au moins 8 caractères</p>
          </div>
        </div>

        {pwdSuccess && (
          <div className="bg-vert-50 border border-vert-200 rounded-lg p-3 mb-4 flex items-center gap-2 text-vert text-sm">
            <CheckCircle className="w-4 h-4" /> Mot de passe mis à jour avec succès !
          </div>
        )}
        {pwdError && (
          <div className="bg-rouge-50 border border-rouge-200 rounded-lg p-3 mb-4 text-rouge text-sm">
            {pwdError}
          </div>
        )}

        <form onSubmit={handleChangePwd} className="space-y-4">
          <div>
            <label className="form-label">Nouveau mot de passe *</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                required
                minLength={8}
                className="form-input pr-10"
                placeholder="Minimum 8 caractères"
                value={pwdForm.new}
                onChange={e => setPwdForm({ ...pwdForm, new: e.target.value })}
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="form-label">Confirmer le nouveau mot de passe *</label>
            <input
              type={showPwd ? 'text' : 'password'}
              required
              className="form-input"
              placeholder="Répétez le mot de passe"
              value={pwdForm.confirm}
              onChange={e => setPwdForm({ ...pwdForm, confirm: e.target.value })}
            />
          </div>
          <button type="submit" disabled={pwdLoading}
            className="btn-primary flex items-center gap-2">
            {pwdLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Mise à jour...</> : <><Save className="w-4 h-4" /> Changer le mot de passe</>}
          </button>
        </form>
      </div>

      {/* Infos association */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-heading font-bold text-lg mb-4">Informations de l&apos;association</h3>
        <div className="space-y-3 text-sm">
          {[
            { label: 'Nom', value: 'Association des Étudiants Algériens de Bordeaux' },
            { label: 'Email', value: 'associationeab@gmail.com' },
            { label: 'Téléphone', value: '06 70 37 67 67' },
            { label: 'Ville', value: 'Bordeaux, France' },
            { label: 'Statut juridique', value: 'Association loi 1901' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="font-medium text-gray-500">{item.label}</span>
              <span className="text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Accès rapides */}
      <div className="bg-vert-50 border border-vert-200 rounded-xl p-5">
        <h3 className="font-heading font-bold text-base mb-3">🔗 Accès rapides</h3>
        <div className="space-y-2 text-sm">
          <a href="https://supabase.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-vert hover:underline">
            → Gérer la base de données (Supabase)
          </a>
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-vert hover:underline">
            → Gérer l&apos;hébergement (Vercel)
          </a>
        </div>
      </div>
    </div>
  )
}
