import React from 'react';
import { Car, Home, Smartphone, Shirt, Wrench, Briefcase, MapPin, Baby, Hammer, Package } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AllCategoriesPage: React.FC = () => {
  const categories = [
    {
      title: 'Véhicules',
      icon: <Car className="w-8 h-8" />,
      color: 'text-blue-600',
      description: 'Voitures, motos, camions et autres véhicules',
      link: 'Voir toutes les annonces >',
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
      icon: <Home className="w-8 h-8" />,
      color: 'text-green-600',
      description: 'Appartements, maisons, terrains et locaux commerciaux',
      link: 'Voir toutes les annonces >',
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
      title: 'Électronique',
      icon: <Smartphone className="w-8 h-8" />,
      color: 'text-purple-600',
      description: 'Téléphones, ordinateurs et appareils électroniques',
      link: 'Voir toutes les annonces >',
      subcategories: [
        'Téléphones & Objets connectés',
        'Ordinateurs',
        'Accessoires informatiques',
        'Photo & vidéo'
      ]
    },
    {
      title: 'Mode',
      icon: <Shirt className="w-8 h-8" />,
      color: 'text-pink-600',
      description: 'Vêtements, chaussures et accessoires de mode',
      link: 'Voir toutes les annonces >',
      subcategories: [
        'Vêtements',
        'Chaussures',
        'Accessoires',
        'Montres & Bijoux'
      ]
    },
    {
      title: 'Maison & Jardin',
      icon: <Wrench className="w-8 h-8" />,
      color: 'text-orange-600',
      description: 'Ameublement, décoration et équipements pour la maison',
      link: 'Voir toutes les annonces >',
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
      icon: <Briefcase className="w-8 h-8" />,
      color: 'text-indigo-600',
      description: 'Services aux entreprises et à la personne',
      link: 'Voir toutes les annonces >',
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
      icon: <Briefcase className="w-8 h-8" />,
      color: 'text-slate-600',
      description: 'Offres d\'emploi et formations professionnelles',
      link: 'Voir toutes les annonces >',
      subcategories: [
        'Offres d\'emploi',
        'Formations professionnelles'
      ]
    },
    {
      title: 'Locations de vacances',
      icon: <MapPin className="w-8 h-8" />,
      color: 'text-teal-600',
      description: 'Locations saisonnières et voyages',
      link: 'Voir toutes les annonces >',
      subcategories: [
        'Locations saisonnières',
        'Ventes flash vacances',
        'Locations Europe'
      ]
    },
    {
      title: 'Famille',
      icon: <Baby className="w-8 h-8" />,
      color: 'text-yellow-600',
      description: 'Équipements et mobilier pour enfants',
      link: 'Voir toutes les annonces >',
      subcategories: [
        'Équipement bébé',
        'Mobilier enfant',
        'Jouets'
      ]
    },
    {
      title: 'Loisirs',
      icon: <Package className="w-8 h-8" />,
      color: 'text-red-600',
      description: 'Divertissement, sport et activités de loisirs',
      link: 'Voir toutes les annonces >',
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
      icon: <Hammer className="w-8 h-8" />,
      color: 'text-amber-600',
      description: 'Équipements et matériel professionnel',
      link: 'Voir toutes les annonces >',
      subcategories: [
        'Tracteurs',
        'BTP - Chantier',
        'Matériel agricole',
        'Équipements pros'
      ]
    },
    {
      title: 'Autre',
      icon: <Package className="w-8 h-8" />,
      color: 'text-gray-600',
      description: 'Articles divers et non catégorisés',
      link: 'Voir toutes les annonces >',
      subcategories: [
        'Divers',
        'Non catégorisé'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <a href="/" className="hover:text-gray-900">🏠 Accueil</a>
          <span>&gt;</span>
          <span className="text-gray-900">Toutes les catégories</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-lg mr-4">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Toutes les catégories</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explorez toutes nos catégories d'annonces et trouvez exactement ce que 
            vous cherchez. Chaque catégorie contient des sous-catégories 
            spécialisées pour vous aider à affiner votre recherche.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              {/* Category Header */}
              <div className="flex items-center mb-4">
                <div className={`${category.color} mr-3`}>
                  {category.icon}
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${category.color}`}>
                    {category.title}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Link */}
              <div className="mb-4">
                <a href="#" className={`${category.color} text-sm font-medium hover:underline`}>
                Voir toutes les annonces &gt;
              </a>
              </div>

              {/* Subcategories */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                  SOUS-CATÉGORIES ({category.subcategories.length})
                </h3>
                <ul className="space-y-2">
                  {category.subcategories.map((subcategory, subIndex) => (
                    <li key={subIndex}>
                      <a 
                        href="#" 
                        className="text-gray-700 hover:text-gray-900 text-sm transition-colors duration-200 hover:underline flex items-center justify-between"
                      >
                        <span>{subcategory}</span>
                        <span className="text-gray-400">&gt;</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AllCategoriesPage;