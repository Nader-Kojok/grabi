import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../utils/currency';

interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string | null;
  location: string;
  images: string[] | null;
  condition: string | null;
  phone: string | null;
  status: string | null;
  views: number | null;
  created_at: string;
  updated_at: string;
  category: {
    id: string;
    name: string;
  } | null;
  subcategory: {
    id: string;
    name: string;
  } | null;
}

interface DashboardStats {
  totalListings: number;
  activeListings: number;
  soldListings: number;
  totalViews: number;
  thisMonthListings: number;
}

const MyListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    activeListings: 0,
    soldListings: 0,
    totalViews: 0,
    thisMonthListings: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/mes-annonces' } });
    }
  }, [user, navigate]);

  // Fetch user listings
  useEffect(() => {
    if (!user) return;

    const fetchListings = async () => {
      try {
        setIsLoading(true);
        setError('');

        const { data, error: fetchError } = await supabase
          .from('listings')
          .select(`
            *,
            category:categories!category_id(id, name),
            subcategory:categories!subcategory_id(id, name)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        const listingsData = (data || []).map((item: Record<string, unknown>) => ({
          ...item,
          condition: item.condition || 'new',
          phone: item.phone || null,
          images: item.images || [],
          currency: item.currency || 'XOF',
          description: item.description || '',
          status: item.status || 'active',
          views: item.views || 0
        })) as Listing[];
        setListings(listingsData);
        setFilteredListings(listingsData);

        // Calculate stats
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const stats: DashboardStats = {
          totalListings: listingsData.length,
          activeListings: listingsData.filter(l => l.status === 'active').length,
          soldListings: listingsData.filter(l => l.status === 'sold').length,
          totalViews: listingsData.reduce((sum, l) => sum + (l.views || 0), 0),
          thisMonthListings: listingsData.filter(l => l.created_at && new Date(l.created_at) >= thisMonth).length
        };
        
        setStats(stats);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Erreur lors du chargement de vos annonces');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [user]);

  // Filter listings based on search and status
  useEffect(() => {
    let filtered = listings;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(listing =>
        listing.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(listing => listing.status === statusFilter);
    }

    setFilteredListings(filtered);
  }, [listings, searchQuery, statusFilter]);

  // Handle status change
  const handleStatusChange = async (listingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', listingId);

      if (error) throw error;

      // Update local state
      setListings(prev => prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, status: newStatus, updated_at: new Date().toISOString() }
          : listing
      ));

      setShowDropdown(null);
    } catch (err) {
      console.error('Error updating listing status:', err);
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  // Handle delete listing
  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;

      // Update local state
      setListings(prev => prev.filter(listing => listing.id !== listingId));
      setShowDropdown(null);
    } catch (err) {
      console.error('Error deleting listing:', err);
      setError('Erreur lors de la suppression de l\'annonce');
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'sold': return <Package className="h-4 w-4 text-blue-500" />;
      case 'inactive': return <XCircle className="h-4 w-4 text-gray-400" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case 'active': return 'Active';
      case 'sold': return 'Vendue';
      case 'inactive': return 'Inactive';
      default: return 'Inconnu';
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'sold': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'inactive': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 hover:bg-white transition-colors border-gray-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 text-left">
                Mes annonces
              </h1>
              <p className="text-gray-600 text-left">
                Gérez vos annonces et suivez leurs performances
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/publier')}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvelle annonce
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-left">{error}</p>
          </div>
        )}

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 text-left">Total</p>
                <p className="text-2xl font-bold text-gray-900 text-left">{stats.totalListings}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 text-left">Actives</p>
                <p className="text-2xl font-bold text-green-600 text-left">{stats.activeListings}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 text-left">Vendues</p>
                <p className="text-2xl font-bold text-blue-600 text-left">{stats.soldListings}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 text-left">Vues totales</p>
                <p className="text-2xl font-bold text-purple-600 text-left">{stats.totalViews}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 text-left">Ce mois</p>
                <p className="text-2xl font-bold text-orange-600 text-left">{stats.thisMonthListings}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Rechercher dans vos annonces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Active</option>
                <option value="sold">Vendue</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span className="ml-3 text-gray-600">Chargement de vos annonces...</span>
            </div>
          </div>
        ) : (
          renderListingsContent()
        )}
      </div>
      
      <Footer />
    </div>
  );

  function renderListingsContent() {
    if (filteredListings.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2 text-left">
            {searchQuery || statusFilter !== 'all' ? 'Aucune annonce trouvée' : 'Aucune annonce'}
          </h3>
          <p className="text-gray-600 mb-6 text-left">
            {searchQuery || statusFilter !== 'all' 
              ? 'Essayez de modifier vos filtres de recherche'
              : 'Commencez par publier votre première annonce'
            }
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Button
              onClick={() => navigate('/publier')}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Publier une annonce
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredListings.map((listing) => (
          <div key={listing.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Image */}
              <div className="flex-shrink-0">
                <img
                  src={listing.images?.[0] || '/images/placeholder.jpg'}
                  alt={listing.title || 'Annonce'}
                  className="w-full lg:w-32 h-32 object-cover rounded-lg"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 text-left truncate">
                      {listing.title || 'Sans titre'}
                    </h3>
                    <p className="text-gray-600 text-left line-clamp-2 mt-1">
                      {listing.description || 'Aucune description'}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{listing.location || 'Non spécifiée'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{listing.views || 0} vues</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{listing.created_at ? new Date(listing.created_at).toLocaleDateString('fr-FR') : 'Date inconnue'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price and Status */}
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-xl font-bold text-red-600 text-left">
                      {formatCurrency(listing.price)}
                    </p>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(listing.status)}`}>
                      {getStatusIcon(listing.status)}
                      {getStatusLabel(listing.status)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    {listing.category && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {listing.category.name}
                      </span>
                    )}
                    {listing.subcategory && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {listing.subcategory.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/product/${listing.id}`)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/publier?edit=${listing.id}`)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Modifier
                    </Button>
                    
                    {/* Dropdown Menu */}
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDropdown(showDropdown === listing.id ? null : listing.id)}
                        className="flex items-center gap-1"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      
                      {showDropdown === listing.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <div className="py-1">
                            {listing.status !== 'active' && (
                              <button
                                onClick={() => handleStatusChange(listing.id, 'active')}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Marquer comme active
                              </button>
                            )}
                            {listing.status !== 'sold' && (
                              <button
                                onClick={() => handleStatusChange(listing.id, 'sold')}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Package className="h-4 w-4 text-blue-500" />
                                Marquer comme vendue
                              </button>
                            )}
                            {listing.status !== 'inactive' && (
                              <button
                                onClick={() => handleStatusChange(listing.id, 'inactive')}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <XCircle className="h-4 w-4 text-gray-400" />
                                Désactiver
                              </button>
                            )}
                            <div className="border-t border-gray-200 my-1"></div>
                            <button
                              onClick={() => handleDeleteListing(listing.id)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Supprimer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default MyListingsPage;
