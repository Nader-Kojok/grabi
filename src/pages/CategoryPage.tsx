import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, SlidersHorizontal, Grid, List, MapPin, Calendar, Heart, Star } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getCategoryBySlug } from '../utils/categories';
import { Button } from '../components/ui/button';
import { mockCurrentListings } from '../data/mockData';

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'price-asc' | 'price-desc'>('recent');
  
  type SortOption = 'recent' | 'price-asc' | 'price-desc';

  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined;

  if (!category) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Catégorie introuvable</h1>
            <p className="text-gray-600 mb-6">La catégorie que vous recherchez n'existe pas.</p>
            <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const IconComponent = category.icon;

  // Filter mock listings by category (for demo purposes)
  const categoryListings = mockCurrentListings.filter(
    listing => listing.category.toLowerCase().includes(category.name.toLowerCase().split(' ')[0])
  );

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "aujourd'hui";
    if (diffInHours < 24) return `il y a ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `il y a ${diffInDays}j`;
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                Accueil
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900 font-medium">{category.name}</span>
            </nav>
          </div>
        </div>

        {/* Category Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-6">
              <div className={`flex items-center justify-center w-16 h-16 rounded-xl bg-gray-50 ${category.color}`}>
                <IconComponent className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
                <p className="text-gray-600 mt-1">
                  {categoryListings.length} annonce{categoryListings.length > 1 ? 's' : ''} disponible{categoryListings.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Subcategories */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {category.subcategories.map((subcategory) => (
                <Link
                  key={subcategory.slug}
                  to={`/category/${category.slug}/${subcategory.slug}`}
                  className="flex items-center justify-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300"
                >
                  {subcategory.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtres
                </Button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="recent">Plus récentes</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="p-2"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="p-2"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Listings */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {categoryListings.length === 0 ? (
            <div className="py-12 text-left">
              <p className="text-gray-600 text-lg">Aucune annonce disponible dans cette catégorie pour le moment.</p>
              <Button onClick={() => navigate('/publier')} className="mt-4">
                Publier une annonce
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
            }>
              {categoryListings.map((listing) => (
                viewMode === 'grid' ? (
                  <div
                    key={listing.id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer group flex flex-col h-full"
                  >
                    {/* Product Image */}
                    <div className="relative h-76 overflow-hidden">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Date Badge */}
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                          {formatTimeAgo(listing.createdAt)}
                        </span>
                      </div>

                      {/* Heart Icon */}
                      <button className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 transition-colors">
                        <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 text-left">
                        {listing.title}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-gray-900">
                          {listing.price.toLocaleString()} {listing.currency}
                        </span>
                      </div>

                      {/* User Info - Fixed at bottom */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center">
                          <img
                            src={listing.user.avatar || '/default-avatar.svg'}
                            alt={listing.user.name}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          <span className="text-sm text-gray-600">{listing.user.name}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm text-gray-600">4.8</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={listing.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 flex"
                  >
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-48 h-full object-cover"
                    />
                    <div className="p-4 flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-left">
                        {listing.title}
                      </h3>
                      <p className="text-2xl font-bold text-red-600 mb-3">
                        {listing.price.toLocaleString('fr-FR')} {listing.currency}
                      </p>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {listing.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(listing.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
                        <img
                          src={listing.user.avatar}
                          alt={listing.user.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="text-sm text-gray-700">{listing.user.name}</span>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
