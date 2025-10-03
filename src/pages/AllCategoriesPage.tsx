import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { allCategories } from '../utils/categories';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AllCategoriesPage: React.FC = () => {
  // Helper function to get category description
  const getCategoryDescription = (categoryName: string): string => {
    const descriptions: Record<string, string> = {
      'Véhicules': 'Voitures, motos, camions et autres véhicules',
      'Immobilier': 'Appartements, maisons, terrains et locaux commerciaux',
      'Electronique': 'Téléphones, ordinateurs et appareils électroniques',
      'Mode': 'Vêtements, chaussures et accessoires de mode',
      'Maison & Jardin': 'Ameublement, décoration et équipements pour la maison',
      'Services': 'Services aux entreprises et à la personne',
      'Emploi': 'Offres d\'emploi et formations professionnelles',
      'Locations de vacances': 'Locations saisonnières et voyages',
      'Famille': 'Équipements et mobilier pour enfants',
      'Loisirs': 'Divertissement, sport et activités de loisirs',
      'Matériel professionnel': 'Équipements et matériel professionnel',
      'Autre': 'Articles divers et non catégorisés'
    };
    return descriptions[categoryName] || '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-gray-900">🏠 Accueil</Link>
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
          {allCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                {/* Category Header */}
                <div className="flex items-center mb-4">
                  <div className={`${category.color} mr-3`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${category.color} text-left`}>
                      {category.name}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1 text-left">
                      {getCategoryDescription(category.name)}
                    </p>
                  </div>
                </div>

                {/* Subcategories */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide text-left">
                      SOUS-CATÉGORIES ({category.subcategories.length})
                    </h3>
                    <Link 
                      to={`/category/${category.slug}`} 
                      className={`${category.color} text-xs font-medium hover:opacity-80 transition-opacity flex items-center gap-1`}
                    >
                      Tout voir
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <ul className="space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <li key={subcategory.slug}>
                        <Link 
                          to={`/category/${category.slug}/${subcategory.slug}`}
                          className="text-gray-700 hover:text-gray-900 text-sm transition-colors duration-200 hover:underline flex items-center justify-between"
                        >
                          <span>{subcategory.name}</span>
                          <span className="text-gray-400">&gt;</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AllCategoriesPage;