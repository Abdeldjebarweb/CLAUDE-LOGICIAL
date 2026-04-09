'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, Loader2 } from 'lucide-react'

const helpTypes = [
  'Attestation d\'hébergement', 'Colocation', 'Recherche de logement',
  'Aide alimentaire', 'Aide administrative', 'Démarches étudiantes',
  'Hébergement d\'urgence', 'Autre besoin'
]

export default function AidePage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    last_name: '', first_name: '', email: '', phone: '', age: '',
    institution: '', field: '', situation: '', help_type: '', urgency: 'medium', description: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('help_requests').insert([{ ...form, age: parseInt(form.age) || 0, status: 'new' }])
    setLoading(false)
    if (!error) setSuccess(true)
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value })

  if (success) return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in-up">
        <CheckCircle className="w-16 h-16 text-vert mx-auto mb-4" />
        <h2 className="font-heading text-2xl font-bold text-gray-900">Demande envoyée !</h2>
        <p className="text-gray-500 mt-2">Nous avons bien reçu votre demande. Un membre de l&apos;équipe vous contactera.</p>
      </div>
    </div>
  )

  return (
    <>
      <section className="bg-rouge py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white">Demander de l&apos;aide</h1>
          <p className="text-white/80 mt-4 text-lg">Vous avez besoin d&apos;aide ? N&apos;hésitez pas, nous sommes là pour vous.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className="form-label">Nom *</label><input required className="form-input" value={form.last_name} onChange={set('last_name')} /></div>
              <div><label className="form-label">Prénom *</label><input required className="form-input" value={form.first_name} onChange={set('first_name')} /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className="form-label">Email *</label><input required type="email" className="form-input" value={form.email} onChange={set('email')} /></div>
              <div><label className="form-label">Téléphone *</label><input required className="form-input" value={form.phone} onChange={set('phone')} /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div><label className="form-label">Âge</label><input type="number" className="form-input" value={form.age} onChange={set('age')} /></div>
              <div><label className="form-label">Établissement</label><input className="form-input" value={form.institution} onChange={set('institution')} /></div>
              <div><label className="form-label">Filière</label><input className="form-input" value={form.field} onChange={set('field')} /></div>
            </div>
            <div><label className="form-label">Situation actuelle</label><input className="form-input" value={form.situation} onChange={set('situation')} placeholder="Ex: nouvel arrivant, étudiant en difficulté..." /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="form-label">Type d&apos;aide *</label>
                <select required className="form-input" value={form.help_type} onChange={set('help_type')}>
                  <option value="">Sélectionner</option>
                  {helpTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Urgence</label>
                <select className="form-input" value={form.urgency} onChange={set('urgency')}>
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Élevée</option>
                  <option value="critical">Urgente</option>
                </select>
              </div>
            </div>
            <div><label className="form-label">Décrivez votre besoin *</label><textarea required rows={5} className="form-input" value={form.description} onChange={set('description')} /></div>
            <button type="submit" disabled={loading} className="btn-rouge w-full flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Envoi...</> : 'Envoyer ma demande'}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
