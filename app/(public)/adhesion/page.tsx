'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, Loader2 } from 'lucide-react'

export default function AdhesionPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState({
    last_name: '', first_name: '', email: '', phone: '', city: '',
    institution: '', field: '', level: '', arrival_year: '', message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    const { error } = await supabase.from('memberships').insert([{ ...form, status: 'pending' }])
    setLoading(false)
    if (error) {
      setErrorMsg("Erreur lors de l'envoi. Veuillez réessayer ou contacter associationeab@gmail.com")
    } else {
      setSuccess(true)
    }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value })

  if (success) return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in-up">
        <CheckCircle className="w-16 h-16 text-vert mx-auto mb-4" />
        <h2 className="font-heading text-2xl font-bold text-gray-900">Demande envoyée !</h2>
        <p className="text-gray-500 mt-2">Merci pour votre adhésion. Nous reviendrons vers vous rapidement.</p>
      </div>
    </div>
  )

  return (
    <>
      <section className="hero-gradient py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white">Rejoindre l&apos;association</h1>
          <p className="text-white/80 mt-4 text-lg">Remplissez le formulaire ci-dessous pour adhérer à l&apos;AEAB.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4">
          {errorMsg && (
            <div className="bg-rouge-50 border border-rouge-200 text-rouge text-sm p-4 rounded-xl mb-6">
              ⚠️ {errorMsg}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  <option>Master 1</option><option>Master 2</option><option>Doctorat</option>
                  <option>Autre</option>
                </select>
              </div>
            </div>
            <div><label className="form-label">Année d&apos;arrivée en France</label><input className="form-input" value={form.arrival_year} onChange={set('arrival_year')} placeholder="ex: 2024" /></div>
            <div><label className="form-label">Message (optionnel)</label><textarea rows={3} className="form-input" value={form.message} onChange={set('message')} /></div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Envoi...</> : "Envoyer ma demande d'adhésion"}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
