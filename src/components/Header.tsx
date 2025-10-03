import React, { useRef, useState, useEffect } from 'react';
import { Search, Menu, Plus, User, ChevronLeft, ChevronRight, Car, Home, Smartphone, Shirt, Wrench, Briefcase, MapPin, Baby, Hammer, Package, Settings, LogOut, UserCircle, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuthStore } from '../stores/authStore';

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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [exitTimeout, setExitTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserDropdown) {
        const target = event.target as Element;
        if (!target.closest('.relative')) {
          setShowUserDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);
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

            {/* Categories Button - Hidden on mobile */}
            <div className="hidden md:flex items-center ml-8">
              <Link to="/categories">
                <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Menu className="h-4 w-4" />
                  Toutes les catégories
                </Button>
              </Link>
            </div>

            {/* Search Bar - Responsive */}
            <div className="flex-1 max-w-md mx-2 md:mx-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Rechercher sur Grabi"
                  className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            {/* User Actions - Responsive */}
            <div className="flex items-center space-x-1 md:space-x-3">
              {/* Desktop Actions */}
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/annonces">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-800 font-normal">
                    <Menu className="h-4 w-4 mr-1" />
                    <span className="hidden lg:inline">Annonces</span>
                  </Button>
                </Link>
                <Link to="/publier">
                  <Button variant="ghost" className="text-gray-600 hover:text-gray-800 font-normal">
                    <Plus className="h-4 w-4 mr-1" />
                    <span className="hidden lg:inline">Publier</span>
                  </Button>
                </Link>
                
                {/* User Profile or Login */}
                {user ? (
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      className="text-gray-600 hover:text-gray-800 font-normal flex items-center space-x-2"
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                    >
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name || 'User'} 
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <UserCircle className="h-6 w-6" />
                      )}
                      <span className="hidden lg:inline">{user.name || 'Mon compte'}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    
                    {/* User Dropdown */}
                    {showUserDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                        <div className="py-1">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <UserCircle className="h-4 w-4 mr-3" />
                            Mon profil
                          </Link>
                          <Link
                            to="/mes-annonces"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <Package className="h-4 w-4 mr-3" />
                            Mes annonces
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <Settings className="h-4 w-4 mr-3" />
                            Paramètres
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              setShowUserDropdown(false);
                              navigate('/');
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Déconnexion
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/login">
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-800 font-normal">
                      <User className="h-4 w-4 mr-1" />
                      <span className="hidden lg:inline">Connexion</span>
                    </Button>
                  </Link>
                )}
              </div>
              
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop with blur effect - using backdrop-blur and lower opacity */}
          <button
            className="absolute inset-0 bg-white/10 backdrop-blur-md backdrop-brightness-75 w-full h-full"
            onClick={() => setShowMobileMenu(false)}
            aria-label="Fermer le menu"
            tabIndex={-1}
          />
          
          {/* Mobile Menu Panel - slides from right */}
          <dialog 
            className="absolute right-0 top-0 bg-white w-64 h-full shadow-xl transform transition-transform duration-300 ease-in-out" 
            aria-label="Menu mobile"
            open
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <img src="/logo.svg" alt="Grabi" className="h-8 w-auto" />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <span className="text-xl">&times;</span>
                </Button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Mobile Navigation Items */}
              <Link 
                to="/annonces" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                <Menu className="h-5 w-5 text-gray-600" />
                <span className="text-gray-800 font-medium">Annonces</span>
              </Link>
              
              <Link 
                to="/publier" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                <Plus className="h-5 w-5 text-gray-600" />
                <span className="text-gray-800 font-medium">Publier</span>
              </Link>
              
              {/* Mobile User Actions */}
              {user ? (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center space-x-3 p-3">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name || 'User'} 
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <UserCircle className="h-8 w-8 text-gray-600" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <UserCircle className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-800 font-medium">Mon profil</span>
                  </Link>
                  
                  <Link 
                    to="/mes-annonces" 
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Package className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-800 font-medium">Mes annonces</span>
                  </Link>
                  
                  <Link 
                    to="/settings" 
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Settings className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-800 font-medium">Paramètres</span>
                  </Link>
                  
                  <button 
                    onClick={() => {
                      logout();
                      setShowMobileMenu(false);
                      navigate('/');
                    }}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
                  >
                    <LogOut className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-800 font-medium">Déconnexion</span>
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-800 font-medium">Connexion</span>
                </Link>
              )}
              
              <div className="border-t border-gray-200 pt-4">
                <Link 
                  to="/categories" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Menu className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-800 font-medium">Toutes les catégories</span>
                </Link>
              </div>
            </div>
          </dialog>
        </div>
      )}

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
            tabIndex={-1}
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
                  <h3 className="text-lg font-semibold text-gray-900 text-left">
                    {currentCategory.name}
                  </h3>
                  <p className="text-sm text-gray-500 text-left">
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