'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, Loader2, Upload, FileText, AlertCircle } from 'lucide-react'

const helpTypes = [
  "Attestation d'hébergement",
  'Colocation',
  'Recherche de logement',
  'Aide alimentaire',
  'Aide administrative',
  'Démarches étudiantes',
  "Hébergement d'urgence",
  'Autre besoin',
]

export default function AidePage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [form, setForm] = useState({
    last_name: '', first_name: '', email: '', phone: '', age: '',
    institution: '', field: '', situation: '', help_type: '', urgency: 'medium', description: '',
  })
  const [passportFile, setPassportFile] = useState<File | null>(null)
  const [inscriptionFile, setInscriptionFile] = useState<File | null>(null)

  const set = (key: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [key]: e.target.value })

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const ext = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('documents').upload(fileName, file)
    if (error) return null
    const { data } = supabase.storage.from('documents').getPublicUrl(fileName)
    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passportFile || !inscriptionFile) {
      alert('Veuillez joindre votre passeport et votre attestation d\'inscription.')
      return
    }
    setLoading(true)

    setUploadProgress('Envoi du passeport...')
    const passportUrl = await uploadFile(passportFile, 'passeports')

    setUploadProgress("Envoi de l'attestation d'inscription...")
    const inscriptionUrl = await uploadFile(inscriptionFile, 'inscriptions')

    setUploadProgress('Enregistrement de la demande...')
    const { error } = await supabase.from('help_requests').insert([{
      ...form,
      age: parseInt(form.age) || 0,
      status: 'new',
      passport_url: passportUrl,
      inscription_url: inscriptionUrl,
    }])

    setLoading(false)
    setUploadProgress('')
    if (!error) setSuccess(true)
  }

  if (success) return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in-up">
        <CheckCircle className="w-16 h-16 text-vert mx-auto mb-4" />
        <h2 className="font-heading text-2xl font-bold text-gray-900">Demande envoyée !</h2>
        <p className="text-gray-500 mt-2 max-w-md">
          Nous avons bien reçu votre demande avec vos documents. Un membre de l&apos;équipe vous contactera très prochainement.
        </p>
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

            {/* Infos personnelles */}
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
            <div>
              <label className="form-label">Situation actuelle</label>
              <input className="form-input" value={form.situation} onChange={set('situation')} placeholder="Ex: nouvel arrivant, étudiant en difficulté..." />
            </div>
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
            <div>
              <label className="form-label">Décrivez votre besoin *</label>
              <textarea required rows={5} className="form-input" value={form.description} onChange={set('description')} />
            </div>

            {/* Documents obligatoires */}
            <div className="bg-vert-50 border border-vert-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-vert" />
                <h3 className="font-heading font-bold text-gray-900">Documents obligatoires</h3>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                <p className="text-xs text-yellow-700">
                  Pour traiter votre demande d&apos;attestation d&apos;hébergement, nous avons besoin de votre passeport et de votre attestation d&apos;inscription à Bordeaux.
                </p>
              </div>

              {/* Passeport */}
              <div className="mb-4">
                <label className="form-label">Passeport (scan ou photo) *</label>
                <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${passportFile ? 'border-vert bg-vert-50' : 'border-gray-300 hover:border-vert hover:bg-vert-50'}`}
                  onClick={() => document.getElementById('passport-input')?.click()}>
                  <input
                    id="passport-input"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={e => setPassportFile(e.target.files?.[0] || null)}
                  />
                  {passportFile ? (
                    <div className="flex items-center justify-center gap-2 text-vert">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{passportFile.name}</span>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Cliquez pour uploader votre passeport</p>
                      <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG — max 10 Mo</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Attestation inscription */}
              <div>
                <label className="form-label">Attestation d&apos;inscription à Bordeaux *</label>
                <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${inscriptionFile ? 'border-vert bg-vert-50' : 'border-gray-300 hover:border-vert hover:bg-vert-50'}`}
                  onClick={() => document.getElementById('inscription-input')?.click()}>
                  <input
                    id="inscription-input"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={e => setInscriptionFile(e.target.files?.[0] || null)}
                  />
                  {inscriptionFile ? (
                    <div className="flex items-center justify-center gap-2 text-vert">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{inscriptionFile.name}</span>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Cliquez pour uploader votre attestation</p>
                      <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG — max 10 Mo</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {uploadProgress && (
              <div className="flex items-center gap-3 text-sm text-vert bg-vert-50 p-3 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
                {uploadProgress}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-rouge w-full flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Envoi en cours...</> : 'Envoyer ma demande'}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
