import React, { useRef, useState, useEffect } from 'react';
import { Search, Menu, Plus, User, ChevronLeft, ChevronRight, Car, Home, Smartphone, Shirt, Wrench, Briefcase, MapPin, Baby, Hammer, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: React.ReactNode;
  color: string;
  subcategories: string[];
}

const Header: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<number | null>(null);
  const [exitTimeout, setExitTimeout] = useState<number | null>(null);

  // Helper function to get category description
  const getCategoryDescription = (categoryName: string): string => {
    const descriptions: { [key: string]: string } = {
      'Véhicules': 'Voitures, motos, bateaux et plus',
      'Immobilier': 'Appartements, maisons et terrains',
      'Electronique': 'Téléphones, ordinateurs et high-tech',
      'Mode': 'Vêtements, chaussures et accessoires',
      'Maison & Jardin': 'Ameublement, décoration et bricolage',
      'Services': 'Services aux entreprises et particuliers',
      'Emploi': 'Offres d\'emploi et formations professionnelles',
      'Locations de vacances': 'Locations saisonnières et voyages',
      'Famille': 'Équipement bébé et mobilier enfant',
      'Loisirs': 'Sport, livres, musique et divertissement',
      'Matériel professionnel': 'Équipements et matériel pro',
      'Autre': 'Divers et non catégorisé'
    };
    return descriptions[categoryName] || 'Découvrez nos annonces';
  };

  // Complete categories with subcategories from CategoriesSection
  const allCategories: Category[] = [
    {
      id: '1',
      name: 'Véhicules',
      slug: 'vehicules',
      icon: <Car className="w-4 h-4" />,
      color: 'text-blue-600',
      subcategories: ['Voitures', 'Motos', 'Camions', 'Bateaux', 'Caravaning', 'Utilitaires', 'Nautisme']
    },
    {
      id: '2',
      name: 'Immobilier',
      slug: 'immobilier',
      icon: <Home className="w-4 h-4" />,
      color: 'text-green-600',
      subcategories: ['Appartements', 'Maisons', 'Terrains', 'Locaux commerciaux', 'Colocations', 'Bureaux & Commerces']
    },
    {
      id: '3',
      name: 'Electronique',
      slug: 'electronique',
      icon: <Smartphone className="w-4 h-4" />,
      color: 'text-purple-600',
      subcategories: ['Téléphones & Objets connectés', 'Ordinateurs', 'Accessoires informatiques', 'Photo & vidéo']
    },
    {
      id: '4',
      name: 'Mode',
      slug: 'mode',
      icon: <Shirt className="w-4 h-4" />,
      color: 'text-pink-600',
      subcategories: ['Vêtements', 'Chaussures', 'Accessoires', 'Montres & Bijoux']
    },
    {
      id: '5',
      name: 'Maison & Jardin',
      slug: 'maison-jardin',
      icon: <Wrench className="w-4 h-4" />,
      color: 'text-orange-600',
      subcategories: ['Ameublement', 'Appareils électroménagers', 'Décoration', 'Plantes & jardin', 'Bricolage']
    },
    {
      id: '6',
      name: 'Services',
      slug: 'services',
      icon: <Briefcase className="w-4 h-4" />,
      color: 'text-indigo-600',
      subcategories: ['Services aux entreprises', 'Services à la personne', 'Événements', 'Artisans & Musiciens', 'Baby-Sitting', 'Cours particuliers']
    },
    {
      id: '7',
      name: 'Emploi',
      slug: 'emploi',
      icon: <Briefcase className="w-4 h-4" />,
      color: 'text-slate-600',
      subcategories: ['Offres d\'emploi', 'Formations professionnelles']
    },
    {
      id: '8',
      name: 'Locations de vacances',
      slug: 'locations-vacances',
      icon: <MapPin className="w-4 h-4" />,
      color: 'text-teal-600',
      subcategories: ['Locations saisonnières', 'Ventes flash vacances', 'Locations Europe']
    },
    {
      id: '9',
      name: 'Famille',
      slug: 'famille',
      icon: <Baby className="w-4 h-4" />,
      color: 'text-yellow-600',
      subcategories: ['Équipement bébé', 'Mobilier enfant', 'Jouets']
    },
    {
      id: '10',
      name: 'Loisirs',
      slug: 'loisirs',
      icon: <Package className="w-4 h-4" />,
      color: 'text-red-600',
      subcategories: ['CD - Musique', 'DVD - Films', 'Livres', 'Jeux & Jouets', 'Sport & Plein Air']
    },
    {
      id: '11',
      name: 'Matériel professionnel',
      slug: 'materiel-professionnel',
      icon: <Hammer className="w-4 h-4" />,
      color: 'text-amber-600',
      subcategories: ['Tracteurs', 'BTP - Chantier', 'Matériel agricole', 'Équipements pros']
    },
    {
      id: '12',
      name: 'Autre',
      slug: 'autre',
      icon: <Package className="w-4 h-4" />,
      color: 'text-gray-600',
      subcategories: ['Divers', 'Non catégorisé']
    }
  ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleCategoryHover = (categoryId: string) => {
    // Clear any existing timeouts
    if (hoverTimeout) clearTimeout(hoverTimeout);
    if (exitTimeout) clearTimeout(exitTimeout);

    // Set hover delay of 500ms before showing mega menu
    const timeout = setTimeout(() => {
      setHoveredCategory(categoryId);
      setShowMegaMenu(true);
    }, 500);
    
    setHoverTimeout(timeout);
  };

  const handleCategoryLeave = () => {
    // Clear hover timeout if still pending
    if (hoverTimeout) clearTimeout(hoverTimeout);
    
    // Set exit delay of 100ms before hiding mega menu
    const timeout = setTimeout(() => {
      setHoveredCategory(null);
      setShowMegaMenu(false);
    }, 100);
    
    setExitTimeout(timeout);
  };

  const handleMegaMenuEnter = () => {
    // Clear exit timeout when entering mega menu
    if (exitTimeout) clearTimeout(exitTimeout);
  };

  const handleMegaMenuLeave = () => {
    // Hide mega menu immediately when leaving
    setHoveredCategory(null);
    setShowMegaMenu(false);
  };

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, categoryId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setHoveredCategory(categoryId);
      setShowMegaMenu(true);
    } else if (event.key === 'Escape') {
      setHoveredCategory(null);
      setShowMegaMenu(false);
    }
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      if (exitTimeout) clearTimeout(exitTimeout);
    };
  }, [hoverTimeout, exitTimeout]);

  const currentCategory = allCategories.find(cat => cat.id === hoveredCategory);

  return (
    <>
      <header className="bg-white border-b border-gray-200 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/">
                <img 
                  src="/logo.svg" 
                  alt="Grabi" 
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Categories Button */}
            <div className="flex items-center ml-8">
              <Link to="/categories">
                <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Menu className="h-4 w-4" />
                  Toutes les catégories
                </Button>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Rechercher sur Grabi"
                  className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              <Link to="/annonces">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-800 font-normal">
                  <Menu className="h-4 w-4 mr-1" />
                  Annonces
                </Button>
              </Link>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-800 font-normal">
                <Plus className="h-4 w-4 mr-1" />
                Publier
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-800 font-normal">
                <User className="h-4 w-4 mr-1" />
                Connexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Category Navigation Bar with Mega Menu */}
      <div className="bg-gray-50 border-b border-gray-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-3">
            {/* Left Arrow */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 mr-2 hover:bg-gray-200"
              onClick={scrollLeft}
              aria-label="Faire défiler les catégories vers la gauche"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </Button>

            {/* Categories Container */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex items-center space-x-1 whitespace-nowrap">
                {allCategories.map((category, index) => (
                  <React.Fragment key={category.id}>
                    <div
                      className="relative"
                      onMouseEnter={() => handleCategoryHover(category.id)}
                      onMouseLeave={handleCategoryLeave}
                    >
                      <Link
                        to={`/category/${category.slug}`}
                        className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                        onKeyDown={(e) => handleKeyDown(e, category.id)}
                        tabIndex={0}
                        role="button"
                        aria-haspopup="true"
                        aria-expanded={hoveredCategory === category.id}
                        aria-label={`${category.name} - Voir les sous-catégories`}
                      >
                        <span className={category.color}>
                          {category.icon}
                        </span>
                        {category.name}
                      </Link>
                    </div>
                    {index < allCategories.length - 1 && (
                      <span className="text-gray-400 text-sm">•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Right Arrow */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 ml-2 hover:bg-gray-200"
              onClick={scrollRight}
              aria-label="Faire défiler les catégories vers la droite"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Mega Menu */}
        {showMegaMenu && currentCategory && (
          <div
            className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl z-40 rounded-lg mx-4"
            onMouseEnter={handleMegaMenuEnter}
            onMouseLeave={handleMegaMenuLeave}
            role="menu"
            aria-label={`Sous-catégories de ${currentCategory.name}`}
          >
            <div className="p-6">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50">
                  <span className={`${currentCategory.color} text-lg`}>
                    {currentCategory.icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {currentCategory.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {getCategoryDescription(currentCategory.name)}
                  </p>
                </div>
              </div>
              
              {/* Subcategories Grid */}
              <div className="grid grid-cols-2 gap-4">
                {currentCategory.subcategories.map((subcategory, index) => (
                  <div key={index} className="group">
                    <Link
                      to={`/category/${currentCategory.slug}/${subcategory.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                      role="menuitem"
                      tabIndex={0}
                    >
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {subcategory}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </Link>
                  </div>
                ))}
              </div>
              
              {/* View All Link */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  to={`/category/${currentCategory.slug}`}
                  className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded px-2 py-1"
                  role="menuitem"
                >
                  Voir toutes les annonces dans {currentCategory.name}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;