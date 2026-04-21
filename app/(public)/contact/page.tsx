'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, Loader2, Mail, MapPin, Phone, Clock, MessageCircle } from 'lucide-react'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await supabase.from('contacts').insert([{ ...form, is_read: false }])
    setLoading(false)
    setSuccess(true)
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value })

  if (success) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center animate-fade-in-up">
        <CheckCircle className="w-16 h-16 text-vert mx-auto mb-4" />
        <h2 className="font-heading text-2xl font-bold">Message envoyé !</h2>
        <p className="text-gray-500 mt-2">Nous vous répondrons dans les plus brefs délais.</p>
      </div>
    </div>
  )

  return (
    <>
      <section className="hero-gradient py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white">Contactez-nous</h1>
          <p className="text-white/80 mt-4 text-lg">Une question ? Un besoin ? Écrivez-nous, nous répondons rapidement.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Formulaire */}
          <div className="lg:col-span-2">
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6">Envoyer un message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><label className="form-label">Nom *</label><input required className="form-input" placeholder="Votre nom" value={form.name} onChange={set('name')} /></div>
                <div><label className="form-label">Email *</label><input required type="email" className="form-input" placeholder="votre@email.com" value={form.email} onChange={set('email')} /></div>
              </div>
              <div><label className="form-label">Sujet *</label><input required className="form-input" placeholder="Ex: Demande d'information" value={form.subject} onChange={set('subject')} /></div>
              <div><label className="form-label">Message *</label><textarea required rows={6} className="form-input" placeholder="Décrivez votre demande..." value={form.message} onChange={set('message')} /></div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Envoi...</> : <><MessageCircle className="w-5 h-5" /> Envoyer le message</>}
              </button>
            </form>
          </div>

          {/* Infos contact */}
          <div className="space-y-5">
            <h2 className="font-heading text-2xl font-bold text-gray-900">Nos coordonnées</h2>

            <a href="mailto:associationeab@gmail.com" className="card p-5 flex items-start gap-4 hover:-translate-y-0.5 transition-transform no-underline group">
              <div className="w-10 h-10 rounded-xl bg-vert-50 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-vert" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Email</h4>
                <p className="text-sm text-vert group-hover:underline mt-0.5">associationeab@gmail.com</p>
              </div>
            </a>

            <a href="tel:0670376767" className="card p-5 flex items-start gap-4 hover:-translate-y-0.5 transition-transform no-underline group">
              <div className="w-10 h-10 rounded-xl bg-vert-50 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-vert" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Téléphone</h4>
                <p className="text-sm text-vert group-hover:underline mt-0.5">06 70 37 67 67</p>
              </div>
            </a>

            <div className="card p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-vert-50 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-vert" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Localisation</h4>
                <p className="text-sm text-gray-500 mt-0.5">Bordeaux, France</p>
              </div>
            </div>

            <div className="card p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-vert-50 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-vert" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Disponibilité</h4>
                <p className="text-sm text-gray-500 mt-0.5">Lun – Ven : 9h – 18h</p>
                <p className="text-xs text-gray-400 mt-0.5">Réponse sous 24–48h</p>
              </div>
            </div>

            <div className="bg-vert-50 border border-vert-200 rounded-xl p-5">
              <p className="text-sm font-semibold text-vert mb-1">🆘 Urgence ?</p>
              <p className="text-xs text-gray-600">Pour toute urgence (hébergement, aide immédiate), appelez directement le <strong>06 70 37 67 67</strong></p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
