export const metadata = { title: 'Politique de confidentialité – AEAB' }

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl border p-8">
          <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">Politique de confidentialité</h1>
          <p className="text-sm text-gray-400 mb-8">Dernière mise à jour : avril 2026</p>

          <div className="space-y-8 text-gray-600 leading-relaxed">
            <section>
              <h2 className="font-heading font-bold text-xl text-gray-900 mb-3">1. Qui sommes-nous ?</h2>
              <p>L&apos;Association des Étudiants Algériens de Bordeaux (AEAB) est une association loi 1901 dont le siège est à Bordeaux, France. Contact : associationeab@gmail.com</p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-gray-900 mb-3">2. Données collectées</h2>
              <p className="mb-3">Nous collectons les données suivantes :</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Nom, prénom, email, téléphone (formulaires de contact et d&apos;adhésion)</li>
                <li>Informations académiques (établissement, filière, niveau)</li>
                <li>Documents justificatifs (carte d&apos;identité, attestation d&apos;inscription) pour les demandes d&apos;aide</li>
                <li>Données de connexion (email, mot de passe hashé) pour l&apos;espace membre</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-gray-900 mb-3">3. Utilisation des données</h2>
              <p className="mb-3">Vos données sont utilisées pour :</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Traiter vos demandes d&apos;adhésion et d&apos;aide</li>
                <li>Vous informer des événements et actualités de l&apos;association</li>
                <li>Gérer votre espace membre et vos réservations</li>
                <li>Améliorer nos services</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-gray-900 mb-3">4. Conservation des données</h2>
              <p>Vos données sont conservées pendant la durée de votre adhésion à l&apos;association, et jusqu&apos;à 3 ans après la fin de votre adhésion pour les données administratives.</p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-gray-900 mb-3">5. Vos droits</h2>
              <p className="mb-3">Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li><strong>Accès</strong> — consulter vos données personnelles</li>
                <li><strong>Rectification</strong> — corriger vos données</li>
                <li><strong>Suppression</strong> — demander l&apos;effacement de vos données</li>
                <li><strong>Opposition</strong> — vous opposer au traitement de vos données</li>
                <li><strong>Portabilité</strong> — recevoir vos données dans un format structuré</li>
              </ul>
              <p className="mt-3">Pour exercer vos droits : <a href="mailto:associationeab@gmail.com" className="text-vert hover:underline">associationeab@gmail.com</a></p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-gray-900 mb-3">6. Sécurité</h2>
              <p>Vos données sont stockées sur les serveurs sécurisés de Supabase (UE). Nous utilisons le chiffrement HTTPS et des mots de passe hashés (bcrypt). L&apos;accès aux données est restreint aux membres du bureau de l&apos;association.</p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-gray-900 mb-3">7. Cookies</h2>
              <p>Ce site utilise uniquement des cookies techniques nécessaires au fonctionnement (authentification). Aucun cookie publicitaire n&apos;est utilisé.</p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-gray-900 mb-3">8. Contact</h2>
              <p>Pour toute question : <a href="mailto:associationeab@gmail.com" className="text-vert hover:underline">associationeab@gmail.com</a></p>
              <p className="mt-2">Vous pouvez également contacter la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-vert hover:underline">www.cnil.fr</a></p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
