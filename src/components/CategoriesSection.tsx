import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { allCategories } from '../utils/categories';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

  return (
    <section className="py-6 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Layout - Expandable accordion */}
        <div className="md:hidden space-y-2">
          {allCategories.map((category, index) => {
            const isExpanded = expandedCategories.has(index);
            const IconComponent = category.icon;
            return (
              <div key={category.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleCategory(index)}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`${category.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className={`font-semibold text-sm ${category.color}`}>
                      {category.name}
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
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.slug}
                          to={`/category/${category.slug}/${subcategory.slug}`}
                          className="text-xs text-gray-600 hover:text-gray-900 hover:bg-white px-2 py-1.5 rounded transition-colors duration-200 block"
                        >
                          {subcategory.name}
                        </Link>
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
          {allCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div 
                key={category.id} 
                className={`p-6 border-r border-b border-gray-200 ${
                  index % 4 === 3 ? 'border-r-0' : ''
                } ${
                  index >= allCategories.length - 4 ? 'border-b-0' : ''
                }`}
              >
                <div className="mb-4">
                  <Link to={`/category/${category.slug}`} className="flex flex-col items-center mb-3 group">
                    <span className={`${category.color} mb-2 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-5 h-5" />
                    </span>
                    <h3 className={`font-bold text-sm uppercase tracking-wide text-center ${category.color} group-hover:underline`}>
                      {category.name}
                    </h3>
                  </Link>
                </div>
                <ul className="space-y-1">
                  {category.subcategories.map((subcategory) => (
                    <li key={subcategory.slug}>
                      <Link 
                        to={`/category/${category.slug}/${subcategory.slug}`}
                        className="text-gray-700 hover:text-gray-900 text-sm transition-colors duration-200 block py-0.5 hover:underline"
                      >
                        {subcategory.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;