import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left">
          <p className="text-sm text-gray-700 leading-relaxed max-w-4xl mx-auto">
            Avec Grabi, trouvez la bonne affaire sur le site référent de petites annonces de particulier à particulier et de professionnels. 
            Avec des millions de petites annonces, trouvez la bonne occasion dans nos catégories{' '}
            <span className="text-red-600 font-medium">voitures</span>,{' '}
            <span className="text-red-600 font-medium">immobilier</span>,{' '}
            <span className="text-red-600 font-medium">emploi</span>,{' '}
            <span className="text-red-600 font-medium">location de vacances</span>,{' '}
            <span className="text-red-600 font-medium">vêtements</span>,{' '}
            <span className="text-red-600 font-medium">meubles</span>,{' '}
            <span className="text-red-600 font-medium">bricolage</span>,{' '}
            <span className="text-red-600 font-medium">téléphonie</span>,{' '}
            <span className="text-red-600 font-medium">jeux vidéo</span>...
          </p>
          <p className="text-sm text-gray-700 leading-relaxed max-w-4xl mx-auto mt-4">
            Déposez une annonce gratuite en toute simplicité pour vendre, rechercher, donner vos biens de seconde main ou promouvoir vos services. 
            Pour cet été, découvrez nos idées de destination avec notre{' '}
            <a href="#" className="text-red-600 font-medium hover:text-red-700 underline">
              guide de vacances au Sénégal
            </a>
            . Achetez en toute sécurité avec notre système de paiement en ligne et de livraison pour les annonces éligibles.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;