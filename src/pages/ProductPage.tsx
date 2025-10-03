import React, { useState } from 'react';
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

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Pour la démo, on utilise les données mockées
  // En production, on ferait un appel API avec l'id
  const product = mockFeaturedProducts.find(p => p.id === id) || mockFeaturedProducts[0];

  // Images simulées pour la galerie
  const productImages = [
    product.image,
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&crop=left',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&crop=right'
  ];

  // Description simulée détaillée
  const fullDescription = `Cette magnifique ${product.title} est en excellent état et prête à être utilisée. 

Caractéristiques principales :
• État impeccable, très peu utilisé
• Toutes les fonctionnalités testées et opérationnelles
• Livré avec tous les accessoires d'origine
• Garantie constructeur encore valide
• Facture d'achat disponible

L'article a été soigneusement entretenu et stocké dans un environnement optimal. Aucun défaut visible, fonctionne parfaitement.

Possibilité de livraison dans un rayon de 50km ou remise en main propre sur ${product.location}.

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
        await navigator.share({
          title: product.title,
          text: `Découvrez cette annonce sur Grabi : ${product.title}`,
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb et navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium text-left">Retour</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full transition-colors ${
                isLiked 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </button>
            
            <button className="p-2 rounded-full bg-white text-gray-600 hover:bg-gray-100 transition-colors">
              <Flag className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Galerie d'images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              {/* Image principale */}
              <div className="relative h-96 md:h-[500px] bg-gray-100">
                <img
                  src={productImages[currentImageIndex]}
                  alt={product.title}
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
                      {productImages.map((_, index) => (
                        <button
                          key={`indicator-${index}`}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.id === 'featured-2' && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Urgent
                    </span>
                  )}
                  {(product.id === 'featured-1' || product.id === 'featured-4') && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Livraison possible
                    </span>
                  )}
                </div>
              </div>
              
              {/* Miniatures */}
              {productImages.length > 1 && (
                <div className="p-4 border-t">
                  <div className="flex space-x-3 overflow-x-auto">
                    {productImages.map((image, index) => (
                      <button
                        key={`thumbnail-${index}`}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex 
                            ? 'border-red-500' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.title} - Vue ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            {/* Prix et titre */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2 text-left">
                    {product.title}
                  </h1>
                  <p className="text-3xl font-bold text-red-600 text-left">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              </div>
              
              {/* Informations de base */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-left">{product.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-left">{formatTimeAgo(product.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-left">247 vues</span>
                </div>
              </div>
            </div>

            {/* Informations vendeur */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left">
                Vendeur
              </h3>
              
              <div className="flex items-center mb-4">
                <img
                  src={product.user.avatar || '/default-avatar.svg'}
                  alt={product.user.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-left">
                    {product.user.name}
                  </h4>
                  <RatingSummary 
                    user={{
                      id: product.user.id,
                      name: product.user.name,
                      email: '',
                      sellerRating: 4.8,
                      reviewCount: 23
                    }}
                    size="sm"
                    showCount={true}
                    className="text-sm"
                  />
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                <span className="text-left">Profil vérifié</span>
              </div>
              
              <div className="space-y-3">
                <button className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors">
                  <MessageCircle className="h-5 w-5 inline mr-2" />
                  Contacter le vendeur
                </button>
                <button className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  <Phone className="h-5 w-5 inline mr-2" />
                  Afficher le numéro
                </button>
              </div>
            </div>

            {/* Sécurité */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 text-left">
                    Conseils de sécurité
                  </h4>
                  <p className="text-sm text-blue-800 mt-1 text-left">
                    Rencontrez le vendeur en personne et vérifiez l'article avant l'achat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description détaillée */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-left">
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
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-left">
            Évaluations du vendeur
          </h2>
          
          <ReviewList 
            sellerId={product.user.id}
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
