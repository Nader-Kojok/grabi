import React from 'react';
import { ChevronLeft, ChevronRight, Car, Smartphone, Home, Shirt, Flame } from 'lucide-react';

interface TrendingCategory {
  id: string;
  title: string;
  subtitle: string;
  searches: number;
  trend: string;
  percentage: string;
  image: string;
  icon: React.ReactNode;
}

const TrendingCategories: React.FC = () => {
  const categories: TrendingCategory[] = [
    {
      id: '1',
      title: 'Véhicules',
      subtitle: '151 recherches',
      searches: 151,
      trend: 'En hausse',
      percentage: '30%',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=400&fit=crop&crop=center',
      icon: <Car className="h-5 w-5" />
    },
    {
      id: '2',
      title: 'Électronique',
      subtitle: '120 recherches',
      searches: 120,
      trend: 'En hausse',
      percentage: '15%',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=400&fit=crop&crop=center',
      icon: <Smartphone className="h-5 w-5" />
    },
    {
      id: '3',
      title: 'Immobilier',
      subtitle: '100 recherches',
      searches: 100,
      trend: 'Stable',
      percentage: '5%',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=400&fit=crop&crop=center',
      icon: <Home className="h-5 w-5" />
    },
    {
      id: '4',
      title: 'Mode',
      subtitle: '89 recherches',
      searches: 89,
      trend: 'En hausse',
      percentage: '30%',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=400&fit=crop&crop=center',
      icon: <Shirt className="h-5 w-5" />
    }
  ];

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Categories Grid */}
        <div className="relative">
          <div className="grid grid-cols-5 gap-4 h-88">
            {/* Intro Card */}
            <div className="bg-gradient-to-br from-orange-100 to-pink-100 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Tendance en ce moment</h2>
                <p className="text-sm text-gray-600 leading-relaxed">Découvrez les catégories les plus recherchées</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="bg-red-500 rounded-full p-2">
                  <Flame className="h-5 w-5 text-white" />
                </div>
                <div className="text-xs text-gray-500">
                  <div>Mis à jour</div>
                  <div>en temps réel</div>
                </div>
              </div>
            </div>

            {/* Category Cards */}
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative rounded-xl overflow-hidden cursor-pointer group"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${category.image})` }}
                >
                  <div className="absolute inset-0"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/0 to-transparent"></div>
                </div>

                {/* Trend Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    category.trend === 'En hausse' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {category.percentage}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="flex items-left text-lg text-white font-bold mb-2  ">{category.title}</h3>
                  <p className="flex items-left text-xs text-white/60 opacity-90 ">{category.subtitle}</p>
                  <div className="flex items-center  text-xs">
                    <span className="text-green-400">↗ {category.trend}</span>
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

export default TrendingCategories;