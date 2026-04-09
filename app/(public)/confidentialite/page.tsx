export const metadata = { title: 'Politique de confidentialité – AEAB' }

export default function ConfidentialitePage() {
  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="font-heading text-3xl font-bold text-gray-900 mb-8">Politique de confidentialité</h1>
        <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
          <h3 className="font-heading font-bold text-gray-900">Données collectées</h3>
          <p>Nous collectons les données que vous fournissez via nos formulaires : nom, prénom, email, téléphone, établissement, et les informations nécessaires au traitement de votre demande.</p>
          <h3 className="font-heading font-bold text-gray-900">Utilisation des données</h3>
          <p>Vos données sont utilisées pour : traiter les adhésions, répondre aux demandes d&apos;aide, gérer les dons, et vous contacter si nécessaire.</p>
          <h3 className="font-heading font-bold text-gray-900">Durée de conservation</h3>
          <p>Les données sont conservées pendant la durée de votre adhésion, plus 3 ans après la fin de celle-ci, sauf obligation légale contraire.</p>
          <h3 className="font-heading font-bold text-gray-900">Vos droits</h3>
          <p>Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et de portabilité de vos données. Vous pouvez exercer ces droits en nous contactant à : contact@aeab.fr</p>
          <h3 className="font-heading font-bold text-gray-900">Sécurité</h3>
          <p>Vos données sont stockées de manière sécurisée via Supabase. Aucune donnée bancaire n&apos;est stockée sur notre site. Les paiements sont traités par des prestataires sécurisés.</p>
        </div>
      </div>
    </section>
  )
}
