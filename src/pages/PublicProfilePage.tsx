import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, UserCircle, MapPin, Calendar, Mail, Activity, Link as LinkIcon, Star, Phone } from 'lucide-react'
import { Button } from '../components/ui/button'
import { VerificationBadges } from '../components/ui/verification-badges'
import RatingSummary from '../components/RatingSummary'
import ReviewList from '../components/ReviewList'
import ReviewForm from '../components/ReviewForm'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import type { User } from '../types'

function PublicProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user: currentUser } = useAuthStore()
  const [seller, setSeller] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews'>('listings')
  const [listings, setListings] = useState<Array<{
    id: string;
    title: string;
    price: number;
    currency: string | null;
    location: string;
    images?: string[] | null;
    created_at: string | null;
    category?: { name: string } | null;
  }>>([])
  const [loadingListings, setLoadingListings] = useState(false)

  // Define fetchSellerProfile with useCallback first
  const fetchSellerProfile = useCallback(async () => {
    if (!id) return
    
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      if (!data) {
        setError('Profil non trouvé')
        setLoading(false)
        return
      }

      // Check if profile is private and current user is not the owner
      if (!data.is_profile_public && (!currentUser || currentUser.id !== data.id)) {
        setError('Ce profil est privé')
        setLoading(false)
        return
      }

      // Transform database profile to User type
      const sellerProfile: User = {
        id: data.id,
        name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.email,
        email: data.email,
        avatar: data.avatar_url || undefined,
        bannerUrl: data.banner_url || undefined,
        phone: data.phone || undefined,
        bio: data.bio || undefined,
        location: data.location || undefined,
        dateOfBirth: data.date_of_birth || undefined,
        website: data.website || undefined,
        socialLinks: (data.social_links as Record<string, string>) || undefined,
        isVerified: data.is_verified || false,
        verificationBadges: data.verification_badges || [],
        profileCompletionPercentage: data.profile_completion_percentage || 0,
        sellerRating: data.seller_rating || undefined,
        reviewCount: data.review_count || 0,
        isProfilePublic: data.is_profile_public || false,
        showEmail: data.show_email || false,
        showPhone: data.show_phone || false,
        allowReviews: data.allow_reviews || false
      }

      setSeller(sellerProfile)
    } catch (err) {
      console.error('Error fetching seller profile:', err)
      setError('Erreur lors du chargement du profil')
    } finally {
      setLoading(false)
    }
  }, [id, currentUser])
  
  // Define fetchSellerListings with useCallback
  const fetchSellerListings = useCallback(async () => {
    if (!seller) return

    try {
      setLoadingListings(true)

      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          title,
          price,
          currency,
          location,
          images,
          created_at,
          category:categories(name)
        `)
        .eq('user_id', seller.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error

      setListings(data || [])
    } catch (err) {
      console.error('Error fetching seller listings:', err)
    } finally {
      setLoadingListings(false)
    }
  }, [seller])
  
  // Now use the functions in useEffect
  useEffect(() => {
    if (!id) {
      setError('Identifiant de profil manquant')
      setLoading(false)
      return
    }

    fetchSellerProfile()
  }, [fetchSellerProfile, id])
  
  useEffect(() => {
    if (seller && activeTab === 'listings') {
      fetchSellerListings()
    }
  }, [seller, activeTab, fetchSellerListings])



  const handleReviewSubmitted = () => {
    // Refresh the seller profile to update the rating
    fetchSellerProfile()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-2/3">
                <div className="h-12 bg-gray-200 rounded-lg mb-4 w-1/3"></div>
                <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="w-full md:w-1/3">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !seller) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {error || 'Profil non trouvé'}
            </h2>
            <p className="text-gray-600 mb-6">
              {error === 'Ce profil est privé' 
                ? 'Ce profil est configuré comme privé et n\'est pas accessible publiquement.'
                : 'Le profil que vous recherchez n\'existe pas ou n\'est plus disponible.'}
            </p>
            <Button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700">
              Retour à l'accueil
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 hover:bg-white transition-colors border-gray-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Banner Section with Overlay */}
          <div className="relative h-64">
            {seller.bannerUrl ? (
              <img 
                src={seller.bannerUrl} 
                alt="Profile Banner" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full bg-gradient-to-r from-red-500 to-red-600"></div>
            )}
            
            {/* Dark gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            {/* User Info Overlay - Positioned over banner */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                {/* Avatar */}
                <div className="relative z-10">
                  <div className="w-40 h-40 rounded-full shadow-xl ring-4 ring-white">
                    {seller.avatar ? (
                      <img src={seller.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                        <UserCircle className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* User Information */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold text-white drop-shadow-lg">{seller.name}</h1>
                      <VerificationBadges user={seller} size="lg" />
                    </div>
                    {seller.sellerRating !== undefined && (
                      <div className="flex items-center gap-2 mt-1">
                        <RatingSummary user={seller} size="md" className="text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Profile Stats */}
                  <div className="flex flex-wrap gap-6 text-sm text-white/80 drop-shadow-md mt-2">
                    {seller.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{seller.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Membre depuis {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 mt-4 sm:mt-0">
                  {currentUser && currentUser.id !== seller.id && (
                    <Button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 shadow-lg border-2 border-white/20">
                      <Mail className="h-4 w-4" />
                      Contacter
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('listings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'listings' 
                ? 'border-red-500 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Activity className="inline-block h-5 w-5 mr-2" />
              Annonces
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' 
                ? 'border-red-500 text-red-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Star className="inline-block h-5 w-5 mr-2" />
              Évaluations {seller.reviewCount ? `(${seller.reviewCount})` : ''}
            </button>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tab Content */}
          <div className="lg:col-span-2">
            {activeTab === 'listings' ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 text-left">Annonces de {seller.name}</h2>
                </div>
                
                {(() => {
                  if (loadingListings) {
                    return (
                      <div className="animate-pulse space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={`skeleton-${i}`} className="h-32 bg-gray-200 rounded-lg"></div>
                        ))}
                      </div>
                    )
                  }
                  
                  if (listings.length === 0) {
                    return (
                      <div className="py-8 text-gray-500 text-left">
                        <p>Aucune annonce active pour le moment.</p>
                      </div>
                    )
                  }
                  
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {listings.map(listing => (
                        <Link 
                          key={listing.id} 
                          to={`/listings/${listing.id}`}
                          className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="aspect-video bg-gray-100 relative">
                            {listing.images?.[0] ? (
                              <img 
                                src={listing.images[0]} 
                                alt={listing.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <span className="text-gray-400">Pas d'image</span>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-gray-900 truncate">{listing.title}</h3>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-red-600 font-bold">
                                {new Intl.NumberFormat('fr-FR', {
                                  style: 'currency',
                                  currency: listing.currency || 'XOF',
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0
                                }).format(listing.price)}
                              </span>
                              <span className="text-sm text-gray-500">{listing.location}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )
                })()}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 text-left">Évaluations</h2>
                </div>
                
                {/* Show review form if current user is not the seller and reviews are allowed */}
                {currentUser && currentUser.id !== seller.id && seller.allowReviews && (
                  <div className="mb-8">
                    <ReviewForm 
                      sellerId={seller.id} 
                      onReviewSubmitted={handleReviewSubmitted}
                    />
                  </div>
                )}
                
                {/* Show message if reviews are disabled */}
                {(!seller.allowReviews) && (
                  <div className="py-8 text-gray-500 text-left">
                    <p>Les évaluations sont désactivées pour ce vendeur.</p>
                  </div>
                )}
                
                <ReviewList sellerId={seller.id} limit={5} />
              </div>
            )}
          </div>

          {/* Sidebar Cards */}
          <div className="space-y-6">
            {/* Seller Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <UserCircle className="h-5 w-5 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-left">À propos du vendeur</h3>
              </div>
              
              {seller.bio && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Bio</h4>
                  <p className="text-gray-600">{seller.bio}</p>
                </div>
              )}
              
              {seller.website && (
                <div className="py-3 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <LinkIcon className="h-4 w-4 text-gray-400" />
                    <a 
                      href={seller.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-700 hover:underline truncate"
                    >
                      {seller.website}
                    </a>
                  </div>
                </div>
              )}
              
              {seller.showEmail && seller.email && (
                <div className="py-3 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{seller.email}</span>
                  </div>
                </div>
              )}
              
              {seller.showPhone && seller.phone && (
                <div className="py-3 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{seller.phone}</span>
                  </div>
                </div>
              )}
              
              {seller.location && (
                <div className="py-3 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{seller.location}</span>
                  </div>
                </div>
              )}
              
              <div className="py-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    Membre depuis {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
              
              {seller.socialLinks && Object.keys(seller.socialLinks).length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Réseaux sociaux</h4>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(seller.socialLinks).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-700"
                      >
                        {platform}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default PublicProfilePage
