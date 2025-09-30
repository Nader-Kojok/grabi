import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const categories = [
  'Véhicules',
  'Immobilier',
  'Électronique',
  'Mode',
  'Maison & Jardin',
  'Services'
];

const CategoryNavigation: React.FC = () => {
  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Left Arrow */}
          <Button variant="ghost" size="sm" className="p-2">
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </Button>

          {/* Categories */}
          <div className="flex items-center space-x-8 flex-1 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors whitespace-nowrap"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <Button variant="ghost" size="sm" className="p-2">
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigation;