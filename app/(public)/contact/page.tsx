'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, Loader2, Mail, MapPin, Phone, Clock, MessageCircle, AlertCircle } from 'lucide-react'
import { useAntiBot, AntiBotField, checkAntiBot } from '@/components/AntiBot'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ nom: '', email: '', subject: '', message: '' })
  const antiBot = useAntiBot()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Vérification anti-bot
    if (!checkAntiBot(antiBot)) {
      setError('Soumission trop rapide. Attendez quelques secondes et réessayez.')
      return
    }

    // Validation basique
    if (form.nom.length < 2) { setError('Nom trop court.'); return }
    if (!form.email.includes('@')) { setError('Email invalide.'); return }
    if (form.message.length < 10) { setError('Message trop court (minimum 10 caractères).'); return }

    setLoading(true)
    const { error: err } = await supabase.from('contacts').insert([{
      nom: form.nom.slice(0, 100),
      email: form.email.toLowerCase().trim(),
      subject: form.subject.slice(0, 200),
      message: form.message.slice(0, 2000),
      is_read: false,
    }])
    setLoading(false)
    if (err) setError('Erreur lors de l\'envoi. Réessayez ou appelez le 06 70 37 67 67.')
    else setSuccess(true)
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
          <p className="text-white/80 mt-4 text-lg">Une question ? Écrivez-nous, nous répondons rapidement.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6">Envoyer un message</h2>
            {error && (
              <div className="bg-rouge-50 border border-rouge-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rouge mt-0.5 flex-shrink-0" />
                <p className="text-sm text-rouge">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Champ anti-bot invisible */}
              <AntiBotField value={antiBot.honeypot} onChange={antiBot.setHoneypot} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Nom *</label>
                  <input required className="form-input" maxLength={100} placeholder="Votre nom"
                    value={form.nom} onChange={set('nom')} />
                </div>
                <div>
                  <label className="form-label">Email *</label>
                  <input required type="email" className="form-input" maxLength={200} placeholder="votre@email.com"
                    value={form.email} onChange={set('email')} />
                </div>
              </div>
              <div>
                <label className="form-label">Sujet *</label>
                <input required className="form-input" maxLength={200} placeholder="Ex: Demande d'information"
                  value={form.subject} onChange={set('subject')} />
              </div>
              <div>
                <label className="form-label">Message * <span className="text-gray-400 font-normal text-xs">(max 2000 caractères)</span></label>
                <textarea required rows={6} className="form-input" maxLength={2000}
                  placeholder="Décrivez votre demande..." value={form.message} onChange={set('message')} />
                <p className="text-xs text-gray-400 mt-1 text-right">{form.message.length}/2000</p>
              </div>
              <button type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Envoi...</> : <><MessageCircle className="w-5 h-5" /> Envoyer le message</>}
              </button>
            </form>
          </div>

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
              <p className="text-xs text-gray-600">Appelez directement le <strong>06 70 37 67 67</strong></p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
