'use client'

import { useState } from 'react'
import { Heart, Utensils, Home, GraduationCap, Calendar, HandHeart, Copy, CheckCircle, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const usages = [
  { icon: Utensils, label: 'Aide alimentaire', desc: 'Colis alimentaires pour étudiants en difficulté' },
  { icon: Home, label: 'Logement d\'urgence', desc: 'Hébergement temporaire pour nouveaux arrivants' },
  { icon: GraduationCap, label: 'Soutien étudiant', desc: 'Fournitures, transports, frais académiques' },
  { icon: Calendar, label: 'Événements', desc: 'Organisation d\'activités culturelles et sociales' },
  { icon: HandHeart, label: 'Actions solidaires', desc: 'Aide aux démarches administratives' },
]

const montants = [5, 10, 20, 50, 100]

export default function DonPage() {
  const [montant, setMontant] = useState(20)
  const [montantCustom, setMontantCustom] = useState('')
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({ nom: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const parsedCustom = montantCustom ? parseInt(montantCustom) : NaN
  const finalMontant = (!isNaN(parsedCustom) && parsedCustom > 0) ? parsedCustom : montant

  const copyRIB = () => {
    navigator.clipboard.writeText('FR76 XXXX XXXX XXXX XXXX XXXX XXX')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async () => {
    if (!form.nom || !form.email) return
    if (!finalMontant || finalMontant <= 0 || isNaN(finalMontant)) return
    await supabase.from('donations').insert([{
      donor_name: form.nom,
      donor_email: form.email,
      amount: finalMontant,
      message: form.message,
      status: 'pending',
    }])
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-rouge py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <Heart className="w-16 h-16 mx-auto mb-4 text-white/60" />
          <h1 className="font-heading text-4xl font-bold text-white mb-4">Faire un don</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Votre générosité permet à l&apos;AEAB d&apos;aider chaque jour des étudiants algériens à Bordeaux.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-auto">
            <path fill="#f9fafb" d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,35 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Formulaire don */}
            <div>
              {submitted ? (
                <div className="bg-white rounded-2xl border p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-vert mx-auto mb-4" />
                  <h2 className="font-heading font-bold text-2xl text-gray-900 mb-2">Merci pour votre don !</h2>
                  <p className="text-gray-600">Votre intention de don de <strong>{finalMontant}€</strong> a été enregistrée. Nous vous contacterons pour finaliser le virement.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border p-6 shadow-sm">
                  <h2 className="font-heading font-bold text-xl mb-5">Choisissez votre montant</h2>

                  {/* Montants prédéfinis */}
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {montants.map(m => (
                      <button key={m} onClick={() => { setMontant(m); setMontantCustom('') }}
                        className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${montant === m && !montantCustom ? 'border-vert bg-vert text-white' : 'border-gray-200 hover:border-vert text-gray-700'}`}>
                        {m}€
                      </button>
                    ))}
                  </div>

                  {/* Montant personnalisé */}
                  <div className="mb-5">
                    <label className="form-label">Autre montant (€)</label>
                    <input type="number" className="form-input" placeholder="Montant libre"
                      value={montantCustom} onChange={e => setMontantCustom(e.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" />
                  </div>

                  <div className="bg-vert-50 border border-vert-200 rounded-xl p-3 mb-5 text-center">
                    <p className="text-vert font-bold text-lg">Don de {finalMontant}€</p>
                  </div>

                  {/* Infos donateur */}
                  <div className="space-y-3 mb-5">
                    <div>
                      <label className="form-label">Votre nom *</label>
                      <input className="form-input" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
                    </div>
                    <div>
                      <label className="form-label">Email *</label>
                      <input type="email" className="form-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div>
                      <label className="form-label">Message (optionnel)</label>
                      <textarea rows={2} className="form-input" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Un mot d'encouragement ?" />
                    </div>
                  </div>

                  {/* Méthodes de paiement */}
                  <div className="space-y-3">
                    <button onClick={handleSubmit} disabled={!form.nom || !form.email}
                      className="w-full bg-rouge text-white py-3.5 rounded-xl font-bold hover:bg-rouge-700 transition-colors flex items-center justify-center gap-2">
                      <Heart className="w-5 h-5" /> Faire un don par virement
                    </button>

                    <div className="border rounded-xl p-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2">RIB pour virement bancaire :</p>
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                        <code className="text-xs text-gray-700">Contactez-nous pour obtenir le RIB</code>
                        <button onClick={() => window.open('mailto:associationeab@gmail.com?subject=Demande RIB pour don', '_blank')}
                          className="text-vert hover:underline text-xs font-semibold">Demander</button>
                      </div>
                    </div>

                    <a href="https://www.helloasso.com/associations/association-des-etudiants-algeriens-de-bordeaux" target="_blank" rel="noopener noreferrer"
                      className="w-full border-2 border-[#49c885] text-[#49c885] py-3 rounded-xl font-bold hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
                      <ExternalLink className="w-4 h-4" /> Don via PayPal
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Comment votre don est utilisé */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border p-6 shadow-sm">
                <h2 className="font-heading font-bold text-xl mb-4">Comment votre don est utilisé ?</h2>
                <div className="space-y-3">
                  {usages.map((u, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="bg-rouge-50 text-rouge w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0">
                        <u.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{u.label}</p>
                        <p className="text-xs text-gray-500">{u.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-vert-50 border border-vert-200 rounded-2xl p-5">
                <p className="text-sm text-vert font-semibold mb-1">🔒 Don sécurisé</p>
                <p className="text-xs text-gray-600">Tous les dons sont gérés par l&apos;AEAB, une association loi 1901 déclarée. Vos données sont confidentielles.</p>
              </div>

              <div className="bg-white rounded-2xl border p-5">
                <p className="font-semibold text-sm mb-1">📞 Autres façons d&apos;aider</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Devenir bénévole</li>
                  <li>• Partager nos événements</li>
                  <li>• Parrainer un étudiant</li>
                  <li>• Don de matériel scolaire</li>
                </ul>
                <a href="/contact" className="text-vert text-xs hover:underline mt-2 inline-block">Nous contacter →</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
