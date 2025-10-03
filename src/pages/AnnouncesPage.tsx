import React, { useState } from 'react';
import { Search, Filter, Grid, List, MapPin, Clock, Heart, Star, ChevronDown } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { mockCurrentListings, mockTopCategories } from '../data/mockData';
import type { Listing } from '../types';

const AnnouncesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Simulation de données d'annonces étendues
  const allListings: Listing[] = [
    ...mockCurrentListings,
    {
      id: '7',
      title: 'Samsung Galaxy S23 Ultra 256GB',
      price: 850000,
      currency: 'FCFA',
      location: 'Dakar',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop',
      user: {
        id: '7',
        name: 'TechStore Dakar',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      },
      category: 'Électronique',
      createdAt: new Date('2024-01-16'),
    },
    {
      id: '8',
      title: 'iPhone 16 Pro Max 128GB',
      price: 1200000,
      currency: 'FCFA',
      location: 'Dakar',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
      user: {
        id: '8',
        name: 'Mobile Plus',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      },
      category: 'Électronique',
      createdAt: new Date('2024-01-15'),
    }
  ];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "aujourd'hui";
    if (diffInHours < 24) return `il y a ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `il y a ${diffInDays}j`;
  };

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'FCFA') {
      return `${price.toLocaleString()} ${currency}`;
    }
    return `${price.toLocaleString()} ${currency}`;
  };

  const filteredListings = allListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'recent':
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  const ListingCard: React.FC<{ listing: Listing }> = ({ listing }) => (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer group flex flex-col h-full">
      {/* Product Image */}
      <div className="relative h-76 overflow-hidden">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {listing.featured && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Sponsorisé
            </span>
          )}
          {listing.id === '7' && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Comme neuf
            </span>
          )}
        </div>

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
  );

  const ListingRow: React.FC<{ listing: Listing }> = ({ listing }) => (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex">
        <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Heart icon */}
          <button className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 transition-colors">
            <Heart className="h-3 w-3 text-gray-600 hover:text-red-500" />
          </button>
        </div>

        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-base font-medium text-gray-900 line-clamp-2 flex-1 mr-4">
              {listing.title}
            </h3>
            <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
              {formatPrice(listing.price, listing.currency)}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            {listing.location}
            <Clock className="h-4 w-4 ml-4 mr-1" />
            {formatTimeAgo(listing.createdAt)}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={listing.user.avatar || '/default-avatar.svg'}
                alt={listing.user.name}
                className="w-5 h-5 rounded-full mr-2"
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
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Toutes les annonces
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Découvrez des milliers d'annonces dans toutes les catégories. 
              Trouvez exactement ce que vous cherchez au meilleur prix.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Rechercher une annonce..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white appearance-none"
                >
                  <option value="all">Toutes catégories</option>
                  {mockTopCategories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white appearance-none"
                >
                  <option value="recent">Plus récentes</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Prix min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-24 px-2 py-1 text-sm border-gray-300 rounded"
                />
                <span className="text-gray-500">-</span>
                <Input
                  type="number"
                  placeholder="Prix max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-24 px-2 py-1 text-sm border-gray-300 rounded"
                />
              </div>
              
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Plus de filtres
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {sortedListings.length} annonces trouvées
            </h2>
            {searchQuery && (
              <span className="text-sm text-gray-500">
                pour "{searchQuery}"
              </span>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-red-500 text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-red-500 text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Listings Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedListings.map((listing) => (
              <ListingRow key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {sortedListings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune annonce trouvée
            </h3>
            <p className="text-gray-500 mb-4">
              Essayez de modifier vos critères de recherche
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              variant="outline"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}

        {/* Load More Button */}
        {sortedListings.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Charger plus d'annonces
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AnnouncesPage;