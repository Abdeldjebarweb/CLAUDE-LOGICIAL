'use client'

import { useState } from 'react'
import { FileText, Download, Search, Folder , Lock } from 'lucide-react'

const docs = [
  {
    categorie: '🏠 Logement',
    fichiers: [
      { nom: 'Modèle lettre recherche logement', desc: 'À envoyer aux propriétaires', type: 'Lettre' },
      { nom: 'Guide demande APL (CAF)', desc: 'Étapes pour obtenir l\'aide au logement', type: 'Guide' },
      { nom: 'Modèle état des lieux', desc: 'Checklist entrée/sortie appartement', type: 'Formulaire' },
      { nom: 'Lettre garant moral', desc: 'Pour les étudiants sans garant financier', type: 'Lettre' },
    ]
  },
  {
    categorie: '📋 Administratif',
    fichiers: [
      { nom: 'Checklist arrivée en France', desc: 'Toutes les démarches à faire à l\'arrivée', type: 'Guide' },
      { nom: 'Guide titre de séjour étudiant', desc: 'Procédure et documents nécessaires', type: 'Guide' },
      { nom: 'Modèle demande de rendez-vous préfecture', desc: 'Email type pour la préfecture', type: 'Lettre' },
      { nom: 'Glossaire administratif français', desc: 'Vocabulaire administratif expliqué', type: 'Guide' },
    ]
  },
  {
    categorie: '🏥 Santé',
    fichiers: [
      { nom: 'Guide sécurité sociale étudiant', desc: 'Comment s\'affilier et utiliser', type: 'Guide' },
      { nom: 'Liste médecins généralistes Bordeaux', desc: 'Médecins acceptant nouveaux patients', type: 'Liste' },
      { nom: 'Guide mutuelle étudiante', desc: 'Comparer et choisir sa mutuelle', type: 'Guide' },
    ]
  },
  {
    categorie: '🎓 Études',
    fichiers: [
      { nom: 'Modèle CV français', desc: 'Format CV adapté au marché français', type: 'Modèle' },
      { nom: 'Modèle lettre de motivation', desc: 'Structure et conseils rédaction', type: 'Modèle' },
      { nom: 'Guide bourses étudiantes', desc: 'CROUS, Eiffel, gouvernement algérien', type: 'Guide' },
      { nom: 'Guide job étudiant', desc: 'Droits, démarches, sites de recherche', type: 'Guide' },
    ]
  },
  {
    categorie: '💰 Finances',
    fichiers: [
      { nom: 'Comparatif banques étudiantes', desc: 'BNP, Boursobank, Hello Bank...', type: 'Guide' },
      { nom: 'Budget type étudiant Bordeaux', desc: 'Estimation dépenses mensuelles', type: 'Guide' },
      { nom: 'Guide envoi d\'argent Algérie-France', desc: 'Western Union, virement...', type: 'Guide' },
    ]
  },
]

const typeColors: Record<string, string> = {
  'Lettre': 'bg-blue-50 text-blue-600',
  'Guide': 'bg-vert-50 text-vert',
  'Formulaire': 'bg-purple-50 text-purple-600',
  'Modèle': 'bg-orange-50 text-orange-600',
  'Liste': 'bg-yellow-50 text-yellow-600',
}

export default function BibliothequeePage() {
  // Protection membre
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const [search, setSearch] = useState('')
  const [openCat, setOpenCat] = useState<string | null>(null)

  const filtered = docs.map(cat => ({
    ...cat,
    fichiers: cat.fichiers.filter(f =>
      f.nom.toLowerCase().includes(search.toLowerCase()) ||
      f.desc.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.fichiers.length > 0)

  if (checkingAuth) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-vert border-t-transparent rounded-full" />
    </div>
  )

  if (!isLoggedIn) return (
    <div className="min-h-screen bg-gray-50">
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-white">Accès réservé</h1>
          <p className="text-white/80 mt-4">Cette page est réservée aux membres de l&apos;AEAB</p>
        </div>
      </section>
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-gray-900 mb-3">Membres uniquement</h2>
        <p className="text-gray-500 mb-6">Connectez-vous ou créez un compte membre pour accéder à cette page.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="/connexion" className="btn-primary">Se connecter</a>
          <a href="/membre" className="btn-outline">Créer un compte</a>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-white">📚 Bibliothèque de documents</h1>
          <p className="text-white/80 mt-4">Modèles, guides et formulaires utiles pour les étudiants algériens</p>
          <div className="mt-6 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-vert"
              placeholder="Rechercher un document..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </section>

      <section className="py-10 max-w-4xl mx-auto px-4">
        <div className="bg-vert-50 border border-vert-200 rounded-xl p-4 mb-6 text-sm text-vert">
          💡 Ces documents sont fournis à titre informatif. Pour obtenir un document personnalisé, 
          <a href="/contact" className="font-semibold underline ml-1">contactez l&apos;AEAB</a>.
        </div>

        <div className="space-y-4">
          {filtered.map((cat) => (
            <div key={cat.categorie} className="bg-white rounded-2xl border overflow-hidden shadow-sm">
              <button onClick={() => setOpenCat(openCat === cat.categorie ? null : cat.categorie)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Folder className="w-5 h-5 text-vert" />
                  <span className="font-heading font-bold text-lg">{cat.categorie}</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{cat.fichiers.length} docs</span>
                </div>
                <span className="text-gray-400">{openCat === cat.categorie ? '▲' : '▼'}</span>
              </button>

              {(openCat === cat.categorie || search) && (
                <div className="border-t divide-y">
                  {cat.fichiers.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{f.nom}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[f.type] || 'bg-gray-100 text-gray-500'}`}>
                          {f.type}
                        </span>
                        <button onClick={() => window.open('/contact', '_blank')}
                          className="flex items-center gap-1.5 text-xs bg-vert text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-vert-700 transition-colors">
                          <Download className="w-3.5 h-3.5" /> Demander
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
