'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, Loader2, Mail, MapPin, Phone } from 'lucide-react'

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
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white">Contact</h1>
          <p className="text-white/80 mt-4 text-lg">Une question ? Écrivez-nous.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><label className="form-label">Nom *</label><input required className="form-input" value={form.name} onChange={set('name')} /></div>
              <div><label className="form-label">Email *</label><input required type="email" className="form-input" value={form.email} onChange={set('email')} /></div>
              <div><label className="form-label">Sujet *</label><input required className="form-input" value={form.subject} onChange={set('subject')} /></div>
              <div><label className="form-label">Message *</label><textarea required rows={6} className="form-input" value={form.message} onChange={set('message')} /></div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Envoi...</> : 'Envoyer le message'}
              </button>
            </form>
          </div>
          <div className="space-y-6">
            <div className="card p-6">
              <Mail className="w-6 h-6 text-vert mb-2" />
              <h4 className="font-semibold">Email</h4>
              <a href="mailto:contact@aeab.fr" className="text-sm text-vert hover:underline">contact@aeab.fr</a>
            </div>
            <div className="card p-6">
              <MapPin className="w-6 h-6 text-vert mb-2" />
              <h4 className="font-semibold">Adresse</h4>
              <p className="text-sm text-gray-500">Bordeaux, France</p>
            </div>
            <div className="card p-6">
              <Phone className="w-6 h-6 text-vert mb-2" />
              <h4 className="font-semibold">Téléphone</h4>
              <p className="text-sm text-gray-500">+33 X XX XX XX XX</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
