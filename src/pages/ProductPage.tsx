import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Calendar, 
  Eye, 
  Shield, 
  MessageCircle, 
  Phone,
  ChevronLeft,
  ChevronRight,
  Flag
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RatingSummary from '../components/RatingSummary';
import ReviewList from '../components/ReviewList';
import { mockFeaturedProducts } from '../data/mockData';
import { formatCurrency } from '../utils/currency';
import { supabase } from '../lib/supabase';

interface DatabaseListing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  location: string;
  images: string[];
  condition: string;
  phone: string | null;
  status: string;
  views: number;
  created_at: string;
  user_id: string;
  category: {
    id: string;
    name: string;
  } | null;
  subcategory: {
    id: string;
    name: string;
  } | null;
  profile: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    seller_rating: number | null;
    review_count: number | null;
  } | null;
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [listing, setListing] = useState<DatabaseListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch listing data from Supabase
  useEffect(() => {
    const fetchListing = async () => {
      if (!id) {
        setError('ID de l\'annonce manquant');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');

        const { data, error: fetchError } = await supabase
          .from('listings')
          .select(`
            *,
            category:categories!category_id(id, name),
            subcategory:categories!subcategory_id(id, name),
            profile:profiles!user_id(id, first_name, last_name, avatar_url, seller_rating, review_count)
          `)
          .eq('id', id)
          .eq('status', 'active')
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError('Annonce non trouvée ou non disponible');
          } else {
            throw fetchError;
          }
          return;
        }

        if (data) {
          setListing(data as unknown as DatabaseListing);
          
          // Increment view count
          await supabase
            .from('listings')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', id);
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Erreur lors du chargement de l\'annonce');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // Use real listing data or fallback to mock data
  const mockProduct = mockFeaturedProducts.find(p => p.id === id) || mockFeaturedProducts[0];

  // Use real images from listing or fallback to mock images
  const getProductImages = () => {
    if (listing) {
      return listing.images && listing.images.length > 0 
        ? listing.images 
        : ['/images/placeholder.jpg'];
    }
    return [
      mockProduct.image || '/images/placeholder.jpg',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&crop=left',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&crop=right'
    ];
  };
  
  const productImages = getProductImages();

  // Use real description or fallback
  const fullDescription = listing 
    ? listing.description 
    : `Cette magnifique ${mockProduct.title} est en excellent état et prête à être utilisée. 

Caractéristiques principales :
• État impeccable, très peu utilisé
• Toutes les fonctionnalités testées et opérationnelles
• Livré avec tous les accessoires d'origine
• Garantie constructeur encore valide
• Facture d'achat disponible

L'article a été soigneusement entretenu et stocké dans un environnement optimal. Aucun défaut visible, fonctionne parfaitement.

Possibilité de livraison dans un rayon de 50km ou remise en main propre sur ${mockProduct.location}.

N'hésitez pas à me contacter pour plus d'informations ou pour organiser une visite.`;

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Publié aujourd'hui";
    if (diffInHours < 24) return `Publié il y a ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Publié hier";
    return `Publié il y a ${diffInDays} jours`;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const title = listing ? listing.title : mockProduct.title;
        await navigator.share({
          title,
          text: `Découvrez cette annonce sur Grabi : ${title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Erreur lors du partage:', error);
      }
    } else {
      // Fallback : copier l'URL
      navigator.clipboard.writeText(window.location.href);
      // Ici on pourrait afficher une notification
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <span className="ml-3 text-gray-600">Chargement de l'annonce...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
              <p className="font-medium">{error}</p>
              <button 
                onClick={() => navigate(-1)}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Retour
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb et navigation */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium text-left">Retour</span>
          </button>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full transition-colors ${
                isLiked 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Ajouter aux favoris"
            >
              <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Partager"
            >
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            
            <button className="p-2 rounded-full bg-white text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Signaler">
              <Flag className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Galerie d'images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              {/* Image principale */}
              <div className="relative h-64 sm:h-96 md:h-[500px] bg-gray-100">
                <img
                  src={productImages[currentImageIndex]}
                  alt={listing ? listing.title : mockProduct.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation des images */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    
                    {/* Indicateurs */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {productImages.map((_, index) => {
                        const uniqueKey = `indicator-${listing?.id || mockProduct.id}-${index}`;
                        return (
                          <button
                            key={uniqueKey}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {mockProduct.id === 'featured-2' && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Urgent
                    </span>
                  )}
                  {(mockProduct.id === 'featured-1' || mockProduct.id === 'featured-4') && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Livraison possible
                    </span>
                  )}
                </div>
              </div>
              
              {/* Miniatures */}
              {productImages.length > 1 && (
                <div className="p-3 sm:p-4 border-t">
                  <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-2">
                    {productImages.map((image, index) => {
                      const uniqueKey = `thumbnail-${listing?.id || mockProduct.id}-${index}`;
                      const title = listing ? listing.title : mockProduct.title;
                      return (
                        <button
                          key={uniqueKey}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                            index === currentImageIndex 
                              ? 'border-red-500' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${title} - Vue ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informations produit */}
          <div className="space-y-4 sm:space-y-6">
            {/* Prix et titre */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-left">
                    {listing ? listing.title : mockProduct.title}
                  </h1>
                  <p className="text-2xl sm:text-3xl font-bold text-red-600 text-left">
                    {formatCurrency(listing ? listing.price : mockProduct.price)}
                  </p>
                </div>
              </div>
              
              {/* Informations de base */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-left">{listing ? listing.location : mockProduct.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-left">{formatTimeAgo(listing ? new Date(listing.created_at) : mockProduct.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-left">{listing ? listing.views || 0 : 247} vues</span>
                </div>
              </div>
            </div>

            {/* Informations vendeur */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 text-left">
                Vendeur
              </h3>
              
              <div className="flex items-center mb-4">
                <img
                  src={listing?.profile?.avatar_url || mockProduct.user?.avatar || '/default-avatar.svg'}
                  alt={listing?.profile ? `${listing.profile.first_name} ${listing.profile.last_name}` : mockProduct.user?.name || 'Vendeur'}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-left">
                    {listing?.profile 
                      ? `${listing.profile.first_name} ${listing.profile.last_name}` 
                      : mockProduct.user?.name || 'Vendeur anonyme'
                    }
                  </h4>
                  <RatingSummary 
                    user={{
                      id: listing?.profile?.id || mockProduct.user?.id || '',
                      name: listing?.profile 
                        ? `${listing.profile.first_name} ${listing.profile.last_name}` 
                        : mockProduct.user?.name || 'Vendeur',
                      email: '',
                      sellerRating: listing?.profile?.seller_rating || 4.8,
                      reviewCount: listing?.profile?.review_count || 23
                    }}
                    showCount={true}
                    className="text-sm"
                  />
                </div>
              </div>
              
              <div className="flex items-center text-sm text-green-600 mb-4">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                <span className="text-left">Profil vérifié</span>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <button className="w-full bg-red-600 text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-medium hover:bg-red-700 transition-colors">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 inline mr-2" />
                  Contacter le vendeur
                </button>
                <button className="w-full bg-gray-100 text-gray-900 py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-200 transition-colors">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 inline mr-2" />
                  Afficher le numéro
                </button>
              </div>
            </div>

            {/* Sécurité */}
            <div className="bg-blue-50 rounded-xl p-3 sm:p-4">
              <div className="flex items-start">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-semibold text-blue-900 text-left">
                    Conseils de sécurité
                  </h4>
                  <p className="text-xs sm:text-sm text-blue-800 mt-1 text-left">
                    Rencontrez le vendeur en personne et vérifiez l'article avant l'achat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description détaillée */}
        <div className="mt-6 sm:mt-8 bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-left">
            Description
          </h2>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line text-left">
              {showFullDescription 
                ? fullDescription 
                : fullDescription.split('\n\n')[0] + '...'
              }
            </p>
            
            {!showFullDescription && (
              <button
                onClick={() => setShowFullDescription(true)}
                className="text-red-600 hover:text-red-700 font-medium mt-2 text-left"
              >
                Voir plus
              </button>
            )}
          </div>
        </div>

        {/* Évaluations du vendeur */}
        <div className="mt-6 sm:mt-8 bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 text-left">
            Évaluations du vendeur
          </h2>
          
          <ReviewList 
            sellerId={listing?.profile?.id || mockProduct.user?.id || ''}
            limit={3}
            showLoadMore={false}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
