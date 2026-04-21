'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Heart, CheckCircle, Loader2 } from 'lucide-react'

const domainesOptions = [
  'Accueil des nouveaux arrivants',
  'Aide administrative (visa, CAF...)',
  'Aide au logement',
  'Organisation d\'événements',
  'Communication & réseaux sociaux',
  'Transport & covoiturage',
  'Aide alimentaire',
  'Soutien scolaire',
  'Informatique & site web',
  'Traduction & interprétariat',
  'Autre',
]

export default function BenevolePage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '',
    disponibilites: '', experience: '', motivation: '',
    domaines: [] as string[],
  })

  const toggleDomaine = (d: string) => {
    setForm(prev => ({
      ...prev,
      domaines: prev.domaines.includes(d)
        ? prev.domaines.filter(x => x !== d)
        : [...prev.domaines, d],
    }))
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await supabase.from('benevoles').insert([{ ...form, statut: 'nouveau' }])
    setLoading(false)
    setSuccess(true)
  }

  if (success) return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in-up">
        <div className="w-20 h-20 rounded-full bg-vert-50 flex items-center justify-center mx-auto mb-4">
          <Heart className="w-10 h-10 text-vert" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-gray-900">Merci pour votre engagement !</h2>
        <p className="text-gray-500 mt-3 max-w-md">
          Nous avons bien reçu votre candidature. Un membre du bureau vous contactera prochainement.
        </p>
      </div>
    </div>
  )

  return (
    <>
      <section className="hero-gradient py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white">Devenir bénévole</h1>
          <p className="text-white/80 mt-4 text-lg">Rejoignez notre équipe et aidez les étudiants algériens à Bordeaux</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4">

          {/* Pourquoi devenir bénévole */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: '🤝', title: 'Solidarité', desc: 'Aidez les nouveaux arrivants à s\'intégrer' },
              { icon: '💼', title: 'Expérience', desc: 'Développez vos compétences associatives' },
              { icon: '👥', title: 'Communauté', desc: 'Rejoignez une équipe soudée et motivée' },
            ].map(item => (
              <div key={item.title} className="bg-vert-50 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className="form-label">Nom *</label><input required className="form-input" value={form.nom} onChange={set('nom')} /></div>
              <div><label className="form-label">Prénom *</label><input required className="form-input" value={form.prenom} onChange={set('prenom')} /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className="form-label">Email *</label><input required type="email" className="form-input" value={form.email} onChange={set('email')} /></div>
              <div><label className="form-label">Téléphone</label><input className="form-input" value={form.telephone} onChange={set('telephone')} /></div>
            </div>

            <div>
              <label className="form-label">Domaines de bénévolat *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {domainesOptions.map(d => (
                  <button key={d} type="button" onClick={() => toggleDomaine(d)}
                    className={`text-left text-sm p-3 rounded-xl border-2 transition-all ${form.domaines.includes(d) ? 'border-vert bg-vert-50 text-vert font-semibold' : 'border-gray-200 text-gray-600 hover:border-vert-300'}`}>
                    {form.domaines.includes(d) ? '✅ ' : '○ '}{d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Disponibilités</label>
              <input className="form-input" placeholder="Ex: Week-ends, soirs en semaine, période estivale..." value={form.disponibilites} onChange={set('disponibilites')} />
            </div>
            <div>
              <label className="form-label">Expérience associative (optionnel)</label>
              <textarea rows={3} className="form-input" placeholder="Décrivez vos expériences associatives ou bénévoles précédentes..." value={form.experience} onChange={set('experience')} />
            </div>
            <div>
              <label className="form-label">Motivation *</label>
              <textarea required rows={4} className="form-input" placeholder="Pourquoi souhaitez-vous rejoindre l'AEAB en tant que bénévole ?" value={form.motivation} onChange={set('motivation')} />
            </div>

            <button type="submit" disabled={loading || form.domaines.length === 0}
              className="btn-rouge w-full flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Envoi...</> : <><Heart className="w-5 h-5" /> Candidater comme bénévole</>}
            </button>
            {form.domaines.length === 0 && <p className="text-xs text-center text-rouge">Sélectionnez au moins un domaine de bénévolat</p>}
          </form>
        </div>
      </section>
    </>
  )
}
