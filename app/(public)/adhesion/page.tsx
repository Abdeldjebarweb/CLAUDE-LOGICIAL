'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, Loader2, Eye, EyeOff, User, Lock, ChevronRight, ChevronLeft } from 'lucide-react'

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
const sanitize = (s: string) => s.replace(/<[^>]*>/g, '').trim().slice(0, 500)

export default function AdhesionPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  const [form, setForm] = useState({
    // Infos personnelles
    last_name: '', first_name: '', email: '', phone: '', city: '',
    institution: '', field: '', level: '', arrival_year: '', message: '',
    // Compte
    password: '', confirm: '',
    visible_annuaire: true,
  })

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value })

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!isValidEmail(form.email)) { setError('Email invalide.'); return }
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 8) { setError('Minimum 8 caractères.'); return }
    if (!/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      setError('Le mot de passe doit contenir au moins une majuscule et un chiffre.')
      return
    }
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas.'); return }

    setLoading(true)

    // 1. Créer le compte Supabase Auth
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: form.email.toLowerCase().trim(),
      password: form.password,
      options: {
        data: { nom: sanitize(form.last_name), prenom: sanitize(form.first_name) }
      }
    })

    if (authErr) {
      if (authErr.message.includes('already registered')) {
        setError('Cet email est déjà utilisé. Connectez-vous sur /connexion.')
      } else {
        setError(authErr.message)
      }
      setLoading(false)
      return
    }

    if (authData.user) {
      // 2. Créer le profil membre
      await supabase.from('membre_accounts').insert([{
        id: authData.user.id,
        email: form.email.toLowerCase().trim(),
        nom: sanitize(form.last_name),
        prenom: sanitize(form.first_name),
        telephone: sanitize(form.phone),
        etablissement: sanitize(form.institution),
        filiere: sanitize(form.field),
        niveau: form.level,
        ville: sanitize(form.city),
        visible_annuaire: form.visible_annuaire,
        statut_adhesion: 'membre_actif',
      }])

      // 3. Créer la demande d'adhésion
      await supabase.from('memberships').insert([{
        first_name: sanitize(form.first_name),
        last_name: sanitize(form.last_name),
        email: form.email.toLowerCase().trim(),
        phone: sanitize(form.phone),
        city: sanitize(form.city),
        institution: sanitize(form.institution),
        field: sanitize(form.field),
        level: form.level,
        arrival_year: form.arrival_year,
        message: sanitize(form.message),
        status: 'pending',
      }])
    }

    setLoading(false)
    setSuccess(true)
  }

  if (success) return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in-up max-w-md">
        <CheckCircle className="w-20 h-20 text-vert mx-auto mb-6" />
        <h2 className="font-heading text-3xl font-bold text-gray-900 mb-3">Bienvenue à l&apos;AEAB !</h2>
        <p className="text-gray-500 mb-2">Votre compte a été créé et votre demande d&apos;adhésion envoyée.</p>
        <p className="text-gray-500 mb-6">Un admin va valider votre adhésion prochainement.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="/connexion" className="btn-primary">Se connecter</a>
          <a href="/" className="btn-outline">Retour à l&apos;accueil</a>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <section className="hero-gradient py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white">Rejoindre l&apos;AEAB</h1>
          <p className="text-white/80 mt-4 text-lg">Créez votre compte et envoyez votre demande d&apos;adhésion en une seule étape.</p>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${step === 1 ? 'bg-white text-vert' : 'bg-white/20 text-white'}`}>
              <User className="w-4 h-4" /> Informations
            </div>
            <ChevronRight className="w-4 h-4 text-white/50" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${step === 2 ? 'bg-white text-vert' : 'bg-white/20 text-white'}`}>
              <Lock className="w-4 h-4" /> Compte
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4">
          {error && (
            <div className="bg-rouge-50 border border-rouge-200 text-rouge text-sm p-4 rounded-xl mb-6">
              ⚠️ {error}
            </div>
          )}

          {/* ÉTAPE 1 — Infos personnelles */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-5">
              <h2 className="font-heading text-xl font-bold text-gray-900 mb-4">Vos informations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label className="form-label">Nom *</label><input required className="form-input" value={form.last_name} onChange={set('last_name')} /></div>
                <div><label className="form-label">Prénom *</label><input required className="form-input" value={form.first_name} onChange={set('first_name')} /></div>
              </div>
              <div><label className="form-label">Email *</label><input required type="email" className="form-input" value={form.email} onChange={set('email')} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label className="form-label">Téléphone</label><input className="form-input" value={form.phone} onChange={set('phone')} /></div>
                <div><label className="form-label">Ville</label><input className="form-input" value={form.city} onChange={set('city')} /></div>
              </div>
              <div><label className="form-label">Établissement *</label><input required className="form-input" value={form.institution} onChange={set('institution')} /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label className="form-label">Filière</label><input className="form-input" value={form.field} onChange={set('field')} /></div>
                <div>
                  <label className="form-label">Niveau d&apos;études</label>
                  <select className="form-input" value={form.level} onChange={set('level')}>
                    <option value="">Sélectionner</option>
                    <option>Licence 1</option><option>Licence 2</option><option>Licence 3</option>
                    <option>Master 1</option><option>Master 2</option><option>Doctorat</option><option>Autre</option>
                  </select>
                </div>
              </div>
              <div><label className="form-label">Année d&apos;arrivée en France</label><input className="form-input" value={form.arrival_year} onChange={set('arrival_year')} placeholder="ex: 2023" /></div>
              <div><label className="form-label">Message (optionnel)</label><textarea rows={3} className="form-input" value={form.message} onChange={set('message')} /></div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                Continuer <ChevronRight className="w-4 h-4" />
              </button>
              <p className="text-center text-sm text-gray-500">
                Déjà un compte ? <a href="/connexion" className="text-vert hover:underline">Se connecter</a>
              </p>
            </form>
          )}

          {/* ÉTAPE 2 — Créer le compte */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-vert mb-2">
                <ChevronLeft className="w-4 h-4" /> Retour
              </button>
              <h2 className="font-heading text-xl font-bold text-gray-900 mb-4">Créer votre compte</h2>

              <div className="bg-vert-50 border border-vert-200 rounded-xl p-4 text-sm text-vert">
                ✅ Inscription pour : <strong>{form.email}</strong>
              </div>

              <div>
                <label className="form-label">Mot de passe * <span className="text-gray-400 font-normal text-xs">(8+ car., 1 maj., 1 chiffre)</span></label>
                <div className="relative">
                  <input required type={showPwd ? 'text' : 'password'} className="form-input pr-10"
                    autoComplete="new-password" minLength={8}
                    value={form.password} onChange={set('password')} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="form-label">Confirmer le mot de passe *</label>
                <input required type="password" className="form-input" autoComplete="new-password"
                  value={form.confirm} onChange={set('confirm')} />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.visible_annuaire}
                  onChange={e => setForm({ ...form, visible_annuaire: e.target.checked })}
                  className="w-4 h-4 accent-vert" />
                <span className="text-sm text-gray-700">Visible dans l&apos;annuaire des membres</span>
              </label>

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Création du compte...</> : "Créer mon compte et envoyer ma demande"}
              </button>

              <p className="text-xs text-gray-400 text-center">
                En vous inscrivant, vous acceptez que vos données soient utilisées dans le cadre de l&apos;AEAB.
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
