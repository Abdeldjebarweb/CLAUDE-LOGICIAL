'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Plane, Home, FileText, CreditCard, Bus, Stethoscope, ShoppingCart, GraduationCap, Phone, ExternalLink } from 'lucide-react'

const sections = [
  {
    icon: Plane,
    title: 'Avant d\'arriver',
    color: 'bg-blue-50 text-blue-600',
    items: [
      { q: 'Visa étudiant', a: 'Faites votre demande de visa étudiant (type D) au consulat français en Algérie. Prévoyez 2-3 mois à l\'avance. Documents nécessaires : lettre d\'admission, justificatif de ressources, assurance rapatriement.' },
      { q: 'Billet d\'avion', a: 'Réservez tôt pour avoir les meilleurs prix. Vols depuis Alger, Oran, Constantine vers Bordeaux (via Paris). Compagnies : Air Algérie, Air France, Transavia.' },
      { q: 'Logement temporaire', a: 'Réservez un hébergement temporaire (Airbnb, auberge de jeunesse) pour les premières semaines le temps de trouver un logement permanent.' },
    ]
  },
  {
    icon: Home,
    title: 'Logement',
    color: 'bg-vert-50 text-vert',
    items: [
      { q: 'Résidences CROUS', a: 'Faites votre demande sur Trouver Mon Master avant le 15 mai. Logements abordables (200-400€/mois). Priorité aux boursiers. Site: crous-bordeaux.fr' },
      { q: 'Appartements privés', a: 'Sites: Le Bon Coin, SeLoger, PAP. Prévoyez 1 mois de caution + 1er loyer. Garant français souvent demandé → utilisez Visale (gratuit, cautionnement par Action Logement).' },
      { q: 'Colocation', a: 'Moins cher et plus convivial. Sites: Roomlala, La Carte des Colocs. Budget moyen: 350-500€/mois charges comprises.' },
      { q: 'CAF - Aide au logement', a: 'Demandez l\'APL dès votre installation sur caf.fr. Aide entre 150-300€/mois selon vos revenus. Documents: contrat de bail, RIB, justificatif de ressources.' },
    ]
  },
  {
    icon: FileText,
    title: 'Démarches administratives',
    color: 'bg-purple-50 text-purple-600',
    items: [
      { q: 'Titre de séjour étudiant', a: 'Demande sur Administration+. À faire dans les 3 mois après l\'arrivée. Rendez-vous en préfecture ou sous-préfecture. Renouvelable chaque année.' },
      { q: 'Numéro de Sécurité Sociale', a: 'Demandez votre numéro à l\'Assurance Maladie (ameli.fr). Délai: 3-6 mois. En attendant, conservez tous vos justificatifs de soins.' },
      { q: 'Inscription à la fac', a: 'Via Parcoursup pour L1. Via application directe pour Master/Doctorat. N\'oubliez pas l\'inscription pédagogique ET administrative.' },
    ]
  },
  {
    icon: CreditCard,
    title: 'Banque & argent',
    color: 'bg-yellow-50 text-yellow-600',
    items: [
      { q: 'Ouvrir un compte bancaire', a: 'Banques classiques: BNP, Société Générale, Crédit Mutuel. Banques en ligne moins chères: Boursobank, Hello Bank, Orange Bank. Documents: pièce d\'identité, justificatif de domicile, visa.' },
      { q: 'Envoyer de l\'argent depuis l\'Algérie', a: 'Western Union, Money Gram disponibles. Virements bancaires internationaux possibles mais longs. Prévoyez une réserve pour les premiers mois.' },
      { q: 'Budget mensuel étudiant', a: 'Loyer: 350-500€ • Alimentation: 200-300€ • Transport: 30€ (carte Wam) • Téléphone: 10-20€ • Loisirs: 50-100€ • TOTAL: 650-1000€/mois minimum.' },
    ]
  },
  {
    icon: Bus,
    title: 'Transport',
    color: 'bg-orange-50 text-orange-600',
    items: [
      { q: 'Carte Wam (TBM)', a: 'Pass étudiant illimité bus/tram à Bordeaux: 28€/mois ou 280€/an. À prendre à une agence TBM avec carte d\'étudiant. Réductions pour boursiers.' },
      { q: 'Vélo', a: 'Bordeaux est très cyclable ! Location longue durée VCUB+ dès 19€/an. Parking vélos gratuits partout. Trajet moyen: 10-15 min à vélo.' },
      { q: 'Paris et autres villes', a: 'TGV Bordeaux-Paris en 2h. OuiGo et Ouibus pour petits budgets. BlaBlaCar pour covoiturage longue distance.' },
    ]
  },
  {
    icon: Stethoscope,
    title: 'Santé',
    color: 'bg-rouge-50 text-rouge',
    items: [
      { q: 'Médecin traitant', a: 'Déclarez un médecin traitant sur ameli.fr dès votre arrivée. Consultation remboursée à 70%. Sans médecin traitant: remboursement réduit.' },
      { q: 'Urgences', a: 'CHU Bordeaux (principal) • 15: SAMU • 15: urgences médicales • 17: police • 18: pompiers • 112: numéro européen. Urgences gratuites même sans carte vitale.' },
      { q: 'Mutuelle étudiante', a: 'Obligatoire depuis 2019. LMDE et HEYME sont les plus connues. Budget: 100-200€/an. Couvre les soins non remboursés par la sécu.' },
    ]
  },
  {
    icon: ShoppingCart,
    title: 'Vie quotidienne',
    color: 'bg-teal-50 text-teal-600',
    items: [
      { q: 'Courses alimentaires', a: 'Lidl et Aldi pour les petits budgets. Leclerc, Carrefour pour le choix. Marché des Capucins (produits frais, prix raisonnables). Épiceries halal dans quartier Bordeaux-Bastide.' },
      { q: 'Restaurants halal', a: 'Nombreux restaurants halal à Bordeaux. Quartiers: Bordeaux-Bastide, Saint-Michel. Sites: Halal Guide, Google Maps avec filtre halal.' },
      { q: 'Mosquées', a: 'Grande Mosquée de Bordeaux (principale). Plusieurs salles de prière dans différents quartiers. Vendredi: prière de Djoumouaa à midi.' },
    ]
  },
  {
    icon: GraduationCap,
    title: 'Études',
    color: 'bg-indigo-50 text-indigo-600',
    items: [
      { q: 'Bibliothèques', a: 'BU (Bibliothèque Universitaire) gratuite avec carte étudiant. Médiathèque de Bordeaux (carte à 5€). Accès WiFi, ordinateurs, salles de travail.' },
      { q: 'Bourses', a: 'Bourse CROUS sur base sociale (dossier sur mobil-note.fr). Bourse du gouvernement algérien (MESRS). Bourse Eiffel pour masters d\'excellence.' },
      { q: 'Travail étudiant', a: 'Droit de travailler 964h/an avec visa étudiant. Sites: Indeed, CIDJ, agences intérim. Jobs campus: bibliothèque, restauration universitaire.' },
    ]
  },
]

const contacts = [
  { label: 'AEAB', value: '06 70 37 67 67', href: 'tel:0670376767' },
  { label: 'SAMU (urgences)', value: '15', href: 'tel:15' },
  { label: 'Police', value: '17', href: 'tel:17' },
  { label: 'Préfecture Gironde', value: '05 56 90 60 60', href: 'tel:0556906060' },
  { label: 'CPAM Bordeaux', value: '36 46', href: 'tel:3646' },
  { label: 'TBM (transports)', value: '05 57 57 88 88', href: 'tel:0557578888' },
]

export default function GuidePage() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-white mb-4">Guide de l&apos;étudiant</h1>
          <p className="text-white/80 text-lg">Tout ce qu&apos;il faut savoir pour bien s&apos;installer à Bordeaux</p>
        </div>
      </section>

      <section className="py-10 max-w-4xl mx-auto px-4">
        {/* Contacts urgences */}
        <div className="bg-white rounded-2xl border p-6 mb-8 shadow-sm">
          <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-vert" /> Numéros utiles
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {contacts.map((c, i) => (
              <a key={i} href={c.href} className="bg-gray-50 rounded-xl p-3 hover:bg-vert-50 transition-colors">
                <p className="text-xs text-gray-400">{c.label}</p>
                <p className="font-bold text-vert text-sm">{c.value}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Sections accordéon */}
        <div className="space-y-4">
          {sections.map((section, si) => (
            <div key={si} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <button
                onClick={() => setOpen(open === section.title ? null : section.title)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors">
                <div className={`${section.color} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <section.icon className="w-5 h-5" />
                </div>
                <span className="font-heading font-bold text-lg flex-1">{section.title}</span>
                {open === section.title ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              {open === section.title && (
                <div className="border-t px-5 pb-5">
                  <div className="space-y-4 pt-4">
                    {section.items.map((item, ii) => (
                      <div key={ii} className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <span className="w-5 h-5 bg-vert text-white rounded-full text-xs flex items-center justify-center flex-shrink-0">{ii + 1}</span>
                          {item.q}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Besoin d'aide */}
        <div className="mt-8 bg-vert rounded-2xl p-6 text-white text-center">
          <h2 className="font-heading font-bold text-xl mb-2">Vous avez d&apos;autres questions ?</h2>
          <p className="text-white/80 mb-4">L&apos;équipe AEAB est là pour vous aider !</p>
          <a href="/contact" className="bg-white text-vert px-6 py-2.5 rounded-xl font-bold hover:bg-white/90 transition-all inline-block">
            Nous contacter
          </a>
        </div>
      </section>
    </div>
  )
}
