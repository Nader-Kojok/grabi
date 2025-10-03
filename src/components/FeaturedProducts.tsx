import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react';
import { mockFeaturedProducts } from '../data/mockData';
import { formatCurrency } from '../utils/currency';

const FeaturedProducts: React.FC = () => {
  const navigate = useNavigate();
  const featuredProducts = mockFeaturedProducts.slice(0, 4); // Afficher seulement les 4 premiers

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "aujourd'hui";
    if (diffInHours < 24) return `il y a ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `il y a ${diffInDays}j`;
  };

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">En ce moment sur Grabi</h2>
          <button className="text-red-600 hover:text-red-700 font-medium text-sm">
            Voir tout
          </button>
        </div>

        {/* Products Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/product/${product.id}`);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Voir l'annonce: ${product.title}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer group flex flex-col h-full"
              >
                {/* Product Image */}
                <div className="relative h-76 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.id === 'featured-2' && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Urgent
                      </span>
                    )}
                    {(product.id === 'featured-1' || product.id === 'featured-4') && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Livraison possible
                      </span>
                    )}
                  </div>

                  {/* Date Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                      {formatTimeAgo(product.createdAt)}
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
                    {product.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(product.price)}
                    </span>
                  </div>

                  {/* User Info - Fixed at bottom */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center">
                      <img
                        src={product.user.avatar || '/default-avatar.svg'}
                        alt={product.user.name}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span className="text-sm text-gray-600">{product.user.name}</span>
                    </div>
                    
                    {/* Rating simulé basé sur l'utilisateur */}
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm text-gray-600">
                        {(() => {
                          switch (product.user.name) {
                            case 'velge': return '4.8';
                            case 'Marie D.': return '4.9';
                            case 'Sophie L.': return '4.7';
                            default: return '4.6';
                          }
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;