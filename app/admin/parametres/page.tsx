'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Save, Loader2, Globe, Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react'

export default function AdminParametres() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    site_name: 'Association des Étudiants Algériens de Bordeaux',
    site_description: 'Solidarité, entraide et accompagnement pour chaque étudiant algérien à Bordeaux.',
    contact_email: 'associationeab@gmail.com',
    contact_phone: '06 70 37 67 67',
    contact_address: 'Bordeaux, France',
    facebook_url: 'https://www.facebook.com/share/g/1bHW7gzQgQ/',
    instagram_url: '',
    twitter_url: '',
    whatsapp_number: '0670376767',
    about_text: '',
    mission_text: '',
  })

  useEffect(() => {
    supabase.from('site_settings').select('*').then(({ data }) => {
      if (data && data.length > 0) {
        const obj: Record<string, string> = {}
        data.forEach((row: any) => { obj[row.key] = row.value })
        setSettings(prev => ({ ...prev, ...obj }))
      }
    })
  }, [])

  const save = async () => {
    setLoading(true)
    const entries = Object.entries(settings).map(([key, value]) => ({ key, value }))
    for (const entry of entries) {
      await supabase.from('site_settings').upsert({ key: entry.key, value: entry.value }, { onConflict: 'key' })
    }
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setSettings(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Paramètres du site</h2>
        <button onClick={save} disabled={loading}
          className="btn-primary flex items-center gap-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</> : <><Save className="w-4 h-4" /> Enregistrer</>}
        </button>
      </div>

      {saved && (
        <div className="bg-vert-50 border border-vert-200 rounded-lg p-3 text-sm text-vert font-semibold">
          ✅ Paramètres enregistrés avec succès !
        </div>
      )}

      {/* Informations générales */}
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h3 className="font-heading font-bold flex items-center gap-2"><Globe className="w-5 h-5 text-vert" /> Informations générales</h3>
        <div>
          <label className="form-label">Nom de l&apos;association</label>
          <input className="form-input" value={settings.site_name} onChange={set('site_name')} />
        </div>
        <div>
          <label className="form-label">Description / Slogan</label>
          <textarea rows={2} className="form-input" value={settings.site_description} onChange={set('site_description')} />
        </div>
      </div>

      {/* Coordonnées */}
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h3 className="font-heading font-bold flex items-center gap-2"><Phone className="w-5 h-5 text-vert" /> Coordonnées</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email</label>
            <input type="email" className="form-input" value={settings.contact_email} onChange={set('contact_email')} />
          </div>
          <div>
            <label className="form-label flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Téléphone</label>
            <input className="form-input" value={settings.contact_phone} onChange={set('contact_phone')} />
          </div>
        </div>
        <div>
          <label className="form-label flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Adresse</label>
          <input className="form-input" value={settings.contact_address} onChange={set('contact_address')} />
        </div>
        <div>
          <label className="form-label">Numéro WhatsApp (sans espaces)</label>
          <input className="form-input" value={settings.whatsapp_number} onChange={set('whatsapp_number')} placeholder="0670376767" />
        </div>
      </div>

      {/* Réseaux sociaux */}
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h3 className="font-heading font-bold flex items-center gap-2"><Facebook className="w-5 h-5 text-vert" /> Réseaux sociaux</h3>
        <div>
          <label className="form-label flex items-center gap-1"><Facebook className="w-3.5 h-3.5" /> Facebook URL</label>
          <input className="form-input" value={settings.facebook_url} onChange={set('facebook_url')} placeholder="https://facebook.com/..." />
        </div>
        <div>
          <label className="form-label flex items-center gap-1"><Instagram className="w-3.5 h-3.5" /> Instagram URL</label>
          <input className="form-input" value={settings.instagram_url} onChange={set('instagram_url')} placeholder="https://instagram.com/..." />
        </div>
      </div>

      {/* Textes des pages */}
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h3 className="font-heading font-bold">📄 Textes des pages</h3>
        <div>
          <label className="form-label">Texte page &quot;À propos&quot;</label>
          <textarea rows={5} className="form-input" value={settings.about_text} onChange={set('about_text')}
            placeholder="Décrivez l'histoire et les valeurs de l'association..." />
        </div>
        <div>
          <label className="form-label">Texte page &quot;Mission&quot;</label>
          <textarea rows={5} className="form-input" value={settings.mission_text} onChange={set('mission_text')}
            placeholder="Décrivez la mission de l'association..." />
        </div>
      </div>

      <button onClick={save} disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</> : <><Save className="w-4 h-4" /> Enregistrer tous les paramètres</>}
      </button>
    </div>
  )
}
