'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, Loader2, Mail, Phone, MapPin, Clock, Heart, HelpCircle, MessageCircle } from 'lucide-react'

const TYPES = [
  { value: 'contact', label: '💬 Contact général', desc: 'Une question, une info' },
  { value: 'aide', label: '🆘 Demande d\'aide', desc: 'Logement, admin, urgence...' },
  { value: 'benevole', label: '❤️ Devenir bénévole', desc: 'Rejoindre l\'équipe AEAB' },
]

const HELP_TYPES = [
  "Attestation d'hébergement",
  'Colocation', 'Recherche de logement',
  'Aide alimentaire', 'Aide administrative',
  'Démarches étudiantes', "Hébergement d'urgence", 'Autre besoin',
]

const DOMAINES = [
  "Accueil des nouveaux arrivants",
  "Aide administrative (visa, CAF...)",
  "Aide au logement", "Organisation d'événements",
  "Communication & réseaux sociaux", "Transport & covoiturage",
  "Aide alimentaire", "Soutien scolaire",
  "Informatique & site web", "Traduction & interprétariat", "Autre",
]

export default function ContactUnifiePage() {
  const [type, setType] = useState('contact')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Champs communs
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')

  // Contact
  const [sujet, setSujet] = useState('')
  const [message, setMessage] = useState('')

  // Aide
  const [age, setAge] = useState('')
  const [institution, setInstitution] = useState('')
  const [filiere, setFiliere] = useState('')
  const [situation, setSituation] = useState('')
  const [helpType, setHelpType] = useState('')
  const [urgence, setUrgence] = useState('medium')
  const [description, setDescription] = useState('')

  // Bénévole
  const [disponibilites, setDisponibilites] = useState('')
  const [experience, setExperience] = useState('')
  const [motivation, setMotivation] = useState('')
  const [domaines, setDomaines] = useState<string[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        setEmail(session.user.email || '')
      }
    })
  }, [])

  const toggleDomaine = (d: string) =>
    setDomaines(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (type === 'contact') {
      await supabase.from('contacts').insert([{
        nom: `${prenom} ${nom}`.trim(),
        email, subject: sujet, message, is_read: false,
      }])
    } else if (type === 'aide') {
      await supabase.from('help_requests').insert([{
        first_name: prenom, last_name: nom, email, phone: telephone,
        age: parseInt(age) || 0, institution, field: filiere,
        situation, help_type: helpType, urgency: urgence,
        description, status: 'new',
      }])
    } else if (type === 'benevole') {
      await supabase.from('benevoles').insert([{
        nom, prenom, email, telephone,
        disponibilites, experience, motivation,
        domaines, statut: 'nouveau',
      }])
    }

    setLoading(false)
    setSuccess(true)
  }

  if (success) return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in-up">
        <CheckCircle className="w-16 h-16 text-vert mx-auto mb-4" />
        <h2 className="font-heading text-2xl font-bold text-gray-900">
          {type === 'contact' ? 'Message envoyé !' : type === 'aide' ? 'Demande envoyée !' : 'Candidature envoyée !'}
        </h2>
        <p className="text-gray-500 mt-2 max-w-md">
          {type === 'contact' && "Nous vous répondrons dans les plus brefs délais."}
          {type === 'aide' && "Un membre de l'équipe vous contactera très prochainement."}
          {type === 'benevole' && "L'équipe AEAB examinera votre candidature et vous contactera."}
        </p>
        <button onClick={() => { setSuccess(false); setMessage(''); setDescription(''); setMotivation('') }}
          className="btn-primary mt-6">Envoyer une autre demande</button>
      </div>
    </div>
  )

  return (
    <>
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white">Contactez-nous</h1>
          <p className="text-white/80 mt-4 text-lg">Choisissez le type de demande ci-dessous</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Formulaire */}
            <div className="lg:col-span-2">

              {/* Sélecteur de type */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {TYPES.map(t => (
                  <button key={t.value} type="button" onClick={() => setType(t.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${type === t.value ? 'border-vert bg-vert-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                    <div className="text-lg mb-1">{t.label.split(' ')[0]}</div>
                    <div className={`text-xs font-semibold ${type === t.value ? 'text-vert' : 'text-gray-700'}`}>
                      {t.label.split(' ').slice(1).join(' ')}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{t.desc}</div>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl border p-6">

                {/* Champs communs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Prénom *</label>
                    <input required className="form-input" value={prenom} onChange={e => setPrenom(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Nom *</label>
                    <input required className="form-input" value={nom} onChange={e => setNom(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Email *</label>
                    <input required type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Téléphone {type !== 'contact' ? '*' : ''}</label>
                    <input className="form-input" value={telephone} onChange={e => setTelephone(e.target.value)}
                      required={type !== 'contact'} />
                  </div>
                </div>

                {/* ── CONTACT ── */}
                {type === 'contact' && (
                  <>
                    <div>
                      <label className="form-label">Sujet *</label>
                      <input required className="form-input" placeholder="Ex: Demande d'information"
                        value={sujet} onChange={e => setSujet(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Message *</label>
                      <textarea required rows={6} className="form-input"
                        placeholder="Votre message..." value={message} onChange={e => setMessage(e.target.value)} />
                    </div>
                  </>
                )}

                {/* ── AIDE ── */}
                {type === 'aide' && (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="form-label">Âge</label>
                        <input type="number" className="form-input" value={age} onChange={e => setAge(e.target.value)} />
                      </div>
                      <div>
                        <label className="form-label">Établissement</label>
                        <input className="form-input" value={institution} onChange={e => setInstitution(e.target.value)} />
                      </div>
                      <div>
                        <label className="form-label">Filière</label>
                        <input className="form-input" value={filiere} onChange={e => setFiliere(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Situation actuelle</label>
                      <input className="form-input" placeholder="Ex: nouvel arrivant, étudiant en difficulté..."
                        value={situation} onChange={e => setSituation(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Type d&apos;aide *</label>
                        <select required className="form-input" value={helpType} onChange={e => setHelpType(e.target.value)}>
                          <option value="">Sélectionner</option>
                          {HELP_TYPES.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Urgence</label>
                        <select className="form-input" value={urgence} onChange={e => setUrgence(e.target.value)}>
                          <option value="low">Faible</option>
                          <option value="medium">Moyenne</option>
                          <option value="high">Élevée</option>
                          <option value="critical">Urgente</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Décrivez votre besoin *</label>
                      <textarea required rows={5} className="form-input" value={description}
                        onChange={e => setDescription(e.target.value)} />
                    </div>
                  </>
                )}

                {/* ── BÉNÉVOLE ── */}
                {type === 'benevole' && (
                  <>
                    <div>
                      <label className="form-label">Domaines *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        {DOMAINES.map(d => (
                          <button key={d} type="button" onClick={() => toggleDomaine(d)}
                            className={`text-left text-xs p-2.5 rounded-lg border-2 transition-all ${domaines.includes(d) ? 'border-vert bg-vert-50 text-vert font-semibold' : 'border-gray-200 text-gray-600'}`}>
                            {domaines.includes(d) ? '✅ ' : '○ '}{d}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Disponibilités</label>
                      <input className="form-input" placeholder="Ex: Week-ends, soirs..."
                        value={disponibilites} onChange={e => setDisponibilites(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Expérience associative</label>
                      <textarea rows={2} className="form-input" value={experience}
                        onChange={e => setExperience(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Motivation *</label>
                      <textarea required rows={4} className="form-input"
                        placeholder="Pourquoi souhaitez-vous rejoindre l'AEAB ?"
                        value={motivation} onChange={e => setMotivation(e.target.value)} />
                    </div>
                  </>
                )}

                <button type="submit"
                  disabled={loading || (type === 'benevole' && domaines.length === 0)}
                  className={`w-full flex items-center justify-center gap-2 ${type === 'benevole' ? 'btn-rouge' : 'btn-primary'}`}>
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Envoi...</> : (
                    type === 'contact' ? <><MessageCircle className="w-5 h-5" /> Envoyer le message</> :
                    type === 'aide' ? <><HelpCircle className="w-5 h-5" /> Envoyer ma demande</> :
                    <><Heart className="w-5 h-5" /> Envoyer ma candidature</>
                  )}
                </button>
              </form>
            </div>

            {/* Coordonnées */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-xl text-gray-900">Nos coordonnées</h3>
              <a href="mailto:associationeab@gmail.com"
                className="card p-4 flex items-center gap-3 no-underline hover:-translate-y-0.5 transition-transform group">
                <div className="w-9 h-9 rounded-xl bg-vert-50 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-vert" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-vert group-hover:underline">associationeab@gmail.com</p>
                </div>
              </a>
              <a href="tel:0670376767"
                className="card p-4 flex items-center gap-3 no-underline hover:-translate-y-0.5 transition-transform group">
                <div className="w-9 h-9 rounded-xl bg-vert-50 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-vert" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Téléphone</p>
                  <p className="text-sm font-medium text-vert group-hover:underline">06 70 37 67 67</p>
                </div>
              </a>
              <div className="card p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-vert-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-vert" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Localisation</p>
                  <p className="text-sm font-medium">Bordeaux, France</p>
                </div>
              </div>
              <div className="card p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-vert-50 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-vert" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Disponibilité</p>
                  <p className="text-sm font-medium">Lun – Ven : 9h – 18h</p>
                  <p className="text-xs text-gray-400">Réponse sous 24–48h</p>
                </div>
              </div>
              <div className="bg-rouge-50 border border-rouge-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-rouge mb-1">🆘 Urgence ?</p>
                <p className="text-xs text-gray-600">Appelez directement le <strong>06 70 37 67 67</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
