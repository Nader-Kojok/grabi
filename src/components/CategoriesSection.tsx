import React from 'react';
import { Car, Home, Smartphone, Shirt, Wrench, Briefcase, MapPin, Baby, Hammer, Package } from 'lucide-react';

const CategoriesSection: React.FC = () => {
  const categories = [
    {
      title: 'Véhicules',
      icon: <Car className="w-5 h-5" />,
      color: 'text-blue-600', // Blue for transportation/mobility
      subcategories: [
        'Voitures',
        'Motos',
        'Camions',
        'Bateaux',
        'Caravaning',
        'Utilitaires',
        'Nautisme'
      ]
    },
    {
      title: 'Immobilier',
      icon: <Home className="w-5 h-5" />,
      color: 'text-green-600', // Green for real estate/property
      subcategories: [
        'Appartements',
        'Maisons',
        'Terrains',
        'Locaux commerciaux',
        'Colocations',
        'Bureaux & Commerces'
      ]
    },
    {
      title: 'Electronique',
      icon: <Smartphone className="w-5 h-5" />,
      color: 'text-purple-600', // Purple for technology/electronics
      subcategories: [
        'Téléphones & Objets connectés',
        'Ordinateurs',
        'Accessoires informatiques',
        'Photo & vidéo'
      ]
    },
    {
      title: 'Mode',
      icon: <Shirt className="w-5 h-5" />,
      color: 'text-pink-600', // Pink for fashion/style
      subcategories: [
        'Vêtements',
        'Chaussures',
        'Accessoires',
        'Montres & Bijoux'
      ]
    },
    {
      title: 'Maison & Jardin',
      icon: <Wrench className="w-5 h-5" />,
      color: 'text-orange-600', // Orange for home improvement/tools
      subcategories: [
        'Ameublement',
        'Appareils électroménagers',
        'Décoration',
        'Plantes & jardin',
        'Bricolage'
      ]
    },
    {
      title: 'Services',
      icon: <Briefcase className="w-5 h-5" />,
      color: 'text-indigo-600', // Indigo for professional services
      subcategories: [
        'Services aux entreprises',
        'Services à la personne',
        'Événements',
        'Artisans & Musiciens',
        'Baby-Sitting',
        'Cours particuliers'
      ]
    },
    {
      title: 'Emploi',
      icon: <Briefcase className="w-5 h-5" />,
      color: 'text-slate-600', // Slate for employment/career
      subcategories: [
        'Offres d\'emploi',
        'Formations professionnelles'
      ]
    },
    {
      title: 'Locations de vacances',
      icon: <MapPin className="w-5 h-5" />,
      color: 'text-teal-600', // Teal for travel/vacation
      subcategories: [
        'Locations saisonnières',
        'Ventes flash vacances',
        'Locations Europe'
      ]
    },
    {
      title: 'Famille',
      icon: <Baby className="w-5 h-5" />,
      color: 'text-yellow-600', // Yellow for family/children (warm, nurturing)
      subcategories: [
        'Équipement bébé',
        'Mobilier enfant',
        'Jouets'
      ]
    },
    {
      title: 'Loisirs',
      icon: <Package className="w-5 h-5" />,
      color: 'text-red-600', // Red for entertainment/leisure (energetic)
      subcategories: [
        'CD - Musique',
        'DVD - Films',
        'Livres',
        'Jeux & Jouets',
        'Sport & Plein Air'
      ]
    },
    {
      title: 'Matériel professionnel',
      icon: <Hammer className="w-5 h-5" />,
      color: 'text-amber-600', // Amber for industrial/professional equipment
      subcategories: [
        'Tracteurs',
        'BTP - Chantier',
        'Matériel agricole',
        'Équipements pros'
      ]
    },
    {
      title: 'Autre',
      icon: <Package className="w-5 h-5" />,
      color: 'text-gray-600', // Gray for miscellaneous/other
      subcategories: [
        'Divers',
        'Non catégorisé'
      ]
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className={`p-6 border-r border-b border-gray-200 ${
                index % 4 === 3 ? 'border-r-0' : ''
              } ${
                index >= categories.length - 4 ? 'border-b-0' : ''
              }`}
            >
              <div className="mb-4">
                <div className="flex flex-col items-center mb-3">
                  <span className={`${category.color} mb-2`}>
                    {category.icon}
                  </span>
                  <h3 className={`font-bold text-sm uppercase tracking-wide text-center ${category.color}`}>
                    {category.title}
                  </h3>
                </div>
              </div>
              <ul className="space-y-1">
                {category.subcategories.map((subcategory, subIndex) => (
                  <li key={subIndex}>
                    <a 
                      href="#" 
                      className="text-gray-700 hover:text-gray-900 text-sm transition-colors duration-200 block py-0.5 hover:underline"
                    >
                      {subcategory}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;