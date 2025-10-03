import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import HomePage from './pages/HomePage';
import AllCategoriesPage from './pages/AllCategoriesPage';
import CategoryPage from './pages/CategoryPage';
import SubcategoryPage from './pages/SubcategoryPage';
import AnnouncesPage from './pages/AnnouncesPage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import PublishPage from './pages/PublishPage';
import MyListingsPage from './pages/MyListingsPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // Initialize auth state on app startup
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<AllCategoriesPage />} />
            <Route path="/category/:categorySlug" element={<CategoryPage />} />
            <Route path="/category/:categorySlug/:subcategorySlug" element={<SubcategoryPage />} />
            <Route path="/annonces" element={<AnnouncesPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:id" element={<PublicProfilePage />} />
            <Route path="/publier" element={<PublishPage />} />
            <Route path="/mes-annonces" element={<MyListingsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
