import React, { useState } from 'react';
import { Car, Home, Smartphone, Shirt, Wrench, Briefcase, MapPin, Baby, Hammer, Package, ChevronDown, ChevronUp } from 'lucide-react';

const CategoriesSection: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  const toggleCategory = (index: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCategories(newExpanded);
  };
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
    <section className="py-6 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Layout - Expandable accordion */}
        <div className="md:hidden space-y-2">
          {categories.map((category, index) => {
            const isExpanded = expandedCategories.has(index);
            return (
              <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleCategory(index)}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`${category.color}`}>
                      {category.icon}
                    </div>
                    <h3 className={`font-semibold text-sm ${category.color}`}>
                      {category.title}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {category.subcategories.length}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>
                
                <div className={`transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}>
                  <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-2">
                      {category.subcategories.map((subcategory, subIndex) => (
                        <a
                          key={subIndex}
                          href="#"
                          className="text-xs text-gray-600 hover:text-gray-900 hover:bg-white px-2 py-1.5 rounded transition-colors duration-200 block"
                        >
                          {subcategory}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Layout - Original grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0">
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