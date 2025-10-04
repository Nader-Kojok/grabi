import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, MapPin, Tag, DollarSign, FileText, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { waveService } from '../services/waveService';
import type { ListingFormData } from '../types/checkout';

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
}

interface CategoryWithSubs extends Category {
  subcategories: Category[];
}

const PublishPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryWithSubs[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    location: '',
    condition: 'new',
    phone: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Fetch categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        
        // Fetch all categories
        const { data: allCategories, error: fetchError } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (fetchError) throw fetchError;

        if (allCategories) {
          // Separate main categories and subcategories
          const mainCategories = allCategories.filter(cat => cat.parent_id === null);
          const subCategories = allCategories.filter(cat => cat.parent_id !== null);

          // Map main categories with their subcategories
          const categoriesWithSubs: CategoryWithSubs[] = mainCategories.map(mainCat => ({
            ...mainCat,
            subcategories: subCategories.filter(sub => sub.parent_id === mainCat.id)
          }));

          setCategories(categoriesWithSubs);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        toast.error('Erreur lors du chargement des catégories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/publier' } });
    }
  }, [user, navigate]);

  // If user is not authenticated, don't render the page
  if (!user) {
    return null;
  }

  // Get selected category's subcategories
  const selectedCategory = categories.find(cat => cat.id === formData.category);
  const subcategories = selectedCategory?.subcategories || [];

  const conditions = [
    { value: 'new', label: 'Neuf' },
    { value: 'like-new', label: 'Comme neuf' },
    { value: 'good', label: 'Bon état' },
    { value: 'fair', label: 'État correct' },
    { value: 'poor', label: 'À rénover' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > 8) {
      toast.error('Vous ne pouvez télécharger que 8 images maximum');
      return;
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error('Seules les images sont acceptées');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Chaque image doit faire moins de 5 MB');
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.title.trim()) {
      toast.error('Le titre est requis');
      setIsLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      toast.error('La description est requise');
      setIsLoading(false);
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Le prix doit être supérieur à 0');
      setIsLoading(false);
      return;
    }

    if (!formData.category) {
      toast.error('Veuillez sélectionner une catégorie');
      setIsLoading(false);
      return;
    }

    if (!formData.location.trim()) {
      toast.error('La localisation est requise');
      setIsLoading(false);
      return;
    }

    if (images.length === 0) {
      toast.error('Veuillez ajouter au moins une image');
      setIsLoading(false);
      return;
    }

    try {
      // First, upload images to Supabase Storage
      console.log('Uploading images before payment...');
      const imageUrls: string[] = [];
      
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `temp_${Date.now()}_${i}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('listings')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Erreur lors de l'upload de l'image ${i + 1}: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('listings')
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
      }

      console.log('Images uploaded successfully:', imageUrls);

      // Create Wave checkout session for listing publication fee
      const listingPrice = waveService.getListingPrice();
      
      const listingData: ListingFormData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        subcategory: formData.subcategory,
        location: formData.location,
        condition: formData.condition,
        phone: formData.phone,
        images: imageUrls // Store URLs instead of File objects
      };

      // Create Wave checkout session
      // We'll create the URLs without session_id first, then Wave will handle the redirect
      const waveResponse = await waveService.createCheckoutSession({
        amount: waveService.formatAmount(listingPrice),
        currency: 'XOF',
        success_url: `${window.location.origin}/payment/success`,
        error_url: `${window.location.origin}/payment/error`,
        client_reference: `listing_${Date.now()}`
      });

      if (!waveResponse.success || !waveResponse.data) {
        throw new Error(waveResponse.error || 'Erreur lors de la création de la session de paiement');
      }

      const waveSession = waveResponse.data;

      // Now update the success/error URLs with the actual Wave session ID
      // Note: This is a workaround since Wave doesn't automatically append session_id
      const actualSuccessUrl = `${window.location.origin}/payment/success?session_id=${waveSession.id}`;
      const actualErrorUrl = `${window.location.origin}/payment/error?session_id=${waveSession.id}`;

      console.log('Wave session created:', {
        id: waveSession.id,
        successUrl: actualSuccessUrl,
        errorUrl: actualErrorUrl
      });

      // Store checkout session in database
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30 minutes expiry

      const checkoutSessionData = {
        wave_session_id: waveSession.id,
        user_id: user!.id,
        amount: listingPrice,
        currency: 'XOF',
        wave_launch_url: waveSession.wave_launch_url,
        success_url: waveSession.success_url,
        error_url: waveSession.error_url,
        client_reference: waveSession.client_reference,
        listing_data: listingData,
        when_expires: expiresAt.toISOString()
      };

      console.log('Saving checkout session to database:', checkoutSessionData);

      const { data: insertedData, error: dbError } = await (supabase as any)
        .from('checkout_sessions')
        .insert(checkoutSessionData)
        .select();

      console.log('Database insert result:', { insertedData, dbError });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Erreur lors de la sauvegarde de la session');
      }

      console.log('Checkout session saved successfully:', insertedData);

      // Redirect to Wave payment
      window.location.href = waveSession.wave_launch_url;
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue lors de la création du paiement');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-4 sm:mb-6 flex items-center gap-2 hover:bg-white transition-colors border-gray-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>

        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-50 rounded-full mb-4">
              <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Publier une annonce
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-3">
              Remplissez les informations ci-dessous pour publier votre annonce
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                <div className="flex-shrink-0">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-medium text-blue-900">
                    Frais de publication : 500 F CFA
                  </p>
                  <p className="text-xs text-blue-700">
                    Paiement sécurisé via Wave • Annonce active immédiatement après paiement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
          {/* Images Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h3 className="block text-base sm:text-lg font-semibold text-gray-900 text-left">
                  Photos de l'annonce
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 text-left">
                  Ajoutez jusqu'à 8 photos (5 MB max par image)
                </p>
              </div>
            </div>

            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-red-400 transition-colors">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3" />
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Cliquez pour télécharger des images
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, JPEG jusqu'à 5 MB
                  </p>
                </div>
              </label>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Photo principale
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 bg-purple-50 rounded-lg flex-shrink-0">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 text-left">
                Informations de base
              </h2>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2 text-left">
                  Titre de l'annonce *
                </label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: iPhone 14 Pro Max 256GB Noir"
                  className="w-full border-gray-300 focus:border-red-500 focus:ring-red-500 h-12"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2 text-left">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez votre article en détail..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  rows={6}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length} caractères
                </p>
              </div>

              {/* Category and Subcategory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2 text-left">
                    Catégorie *
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => {
                        handleInputChange('category', e.target.value);
                        handleInputChange('subcategory', ''); // Reset subcategory when category changes
                      }}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white"
                      required
                      disabled={loadingCategories}
                    >
                      <option value="">
                        {loadingCategories ? 'Chargement...' : 'Sélectionner une catégorie'}
                      </option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subcategory" className="block text-sm font-semibold text-gray-900 mb-2 text-left">
                    Sous-catégorie {subcategories.length > 0 && '*'}
                  </label>
                  <select
                    id="subcategory"
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white"
                    disabled={!formData.category || subcategories.length === 0}
                    required={subcategories.length > 0}
                  >
                    <option value="">
                      {!formData.category 
                        ? 'Sélectionnez d\'abord une catégorie' 
                        : subcategories.length === 0 
                        ? 'Aucune sous-catégorie' 
                        : 'Sélectionner une sous-catégorie'}
                    </option>
                    {subcategories.map(subcategory => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Condition */}
              <div>
                <label htmlFor="condition" className="block text-sm font-semibold text-gray-900 mb-2 text-left">
                  État
                </label>
                <select
                  id="condition"
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white"
                >
                  {conditions.map(condition => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-900 mb-2 text-left">
                  Prix (FCFA) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0"
                    className="w-full pl-10 pr-4 border-gray-300 focus:border-red-500 focus:ring-red-500 h-12"
                    min="0"
                    step="1"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-900 mb-2 text-left">
                  Localisation *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Ex: Dakar, Sénégal"
                    className="w-full pl-10 pr-4 border-gray-300 focus:border-red-500 focus:ring-red-500 h-12"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2 text-left">
                  Numéro de téléphone (optionnel)
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+221 XX XXX XX XX"
                  className="w-full border-gray-300 focus:border-red-500 focus:ring-red-500 h-12"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Si non renseigné, votre numéro de profil sera utilisé
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500">
              * Champs obligatoires
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-8 w-full sm:w-auto text-sm sm:text-base"
              >
                {isLoading ? 'Création du paiement...' : 'Payer et publier (500 F CFA)'}
              </Button>
            </div>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
};

export default PublishPage;
