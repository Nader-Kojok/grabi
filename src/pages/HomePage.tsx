import React from 'react';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import TrendingSearches from '../components/TrendingSearches';
import FeaturedProducts from '../components/FeaturedProducts';
import TrendingCategories from '../components/TrendingCategories';
import CategoriesSection from '../components/CategoriesSection';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroBanner />
      <TrendingSearches />
      <TrendingCategories />
      <FeaturedProducts />
      <AboutSection />
      <CategoriesSection />
      <Footer />
    </div>
  );
};

export default HomePage;