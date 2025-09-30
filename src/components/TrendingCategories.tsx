import React, { useState, useRef, useEffect } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Navigation functions for mobile carousel
  const nextSlide = () => {
    if (currentIndex < categories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      scrollToIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      scrollToIndex(currentIndex - 1);
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  // Touch/Mouse handlers for swipe functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isMobile || !scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile || !scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    updateCurrentIndex();
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    updateCurrentIndex();
  };

  const updateCurrentIndex = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth;
      const newIndex = Math.round(scrollContainerRef.current.scrollLeft / cardWidth);
      setCurrentIndex(Math.max(0, Math.min(newIndex, categories.length - 1)));
    }
  };

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Categories Grid */}
        <div className="relative">
          {/* Desktop Grid */}
          <div className={`${isMobile ? 'hidden' : 'block'} grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 min-h-[22rem]`}>
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

          {/* Mobile Carousel */}
          <div className={`${isMobile ? 'block' : 'hidden'} relative`}>
            {/* Mobile Header */}
            <div className="bg-gradient-to-br from-orange-100 to-pink-100 rounded-xl p-6 mb-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Tendance en ce moment</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">Découvrez les catégories les plus recherchées</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="bg-red-500 rounded-full p-2 mb-2">
                    <Flame className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    <div>Mis à jour</div>
                    <div>en temps réel</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carousel Container */}
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex-none w-full snap-start relative rounded-xl overflow-hidden cursor-pointer group min-h-[20rem]"
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
                    <h3 className="text-xl text-white font-bold mb-2">{category.title}</h3>
                    <p className="text-sm text-white/80 mb-2">{category.subtitle}</p>
                    <div className="flex items-center text-sm">
                      <span className="text-green-400">↗ {category.trend}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Navigation Arrows */}
            <button 
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all z-10 ${
                currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-90 hover:opacity-100'
              }`}
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <button 
              onClick={nextSlide}
              disabled={currentIndex === categories.length - 1}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all z-10 ${
                currentIndex === categories.length - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-90 hover:opacity-100'
              }`}
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-4 space-x-2">
              {categories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    scrollToIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-red-500 w-6' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop Navigation Arrows */}
          <button className={`${isMobile ? 'hidden' : 'block'} absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow`}>
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <button className={`${isMobile ? 'hidden' : 'block'} absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow`}>
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default TrendingCategories;