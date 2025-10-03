import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, List } from 'lucide-react';
import { Button } from '../components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { waveService } from '../services/waveService';
import { useAuthStore } from '../stores/authStore';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState('');
  const [listingCreated, setListingCreated] = useState(false);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!sessionId) {
      setError('ID de session manquant');
      setIsProcessing(false);
      return;
    }

    processPaymentSuccess();
  }, [user, sessionId, navigate]);

  const processPaymentSuccess = async () => {
    try {
      // Ensure we have valid sessionId and user.id
      if (!sessionId || !user?.id) {
        throw new Error('Informations de session ou d\'utilisateur manquantes');
      }

      // 1. Get the checkout session from our database
      const { data: checkoutSession, error: dbError } = await (supabase as any)
        .from('checkout_sessions')
        .select('*')
        .eq('wave_session_id', sessionId)
        .eq('user_id', user.id)
        .single();

      if (dbError || !checkoutSession) {
        throw new Error('Session de paiement introuvable');
      }

      // 2. Verify payment status with Wave API
      const waveResponse = await waveService.getCheckoutSession(sessionId);
      
      if (!waveResponse.success || !waveResponse.data) {
        throw new Error('Impossible de vérifier le statut du paiement');
      }

      const waveSession = waveResponse.data;

      // 3. Check if payment was successful
      if (!waveService.isPaymentSuccessful(waveSession)) {
        throw new Error('Le paiement n\'a pas été confirmé');
      }

      // 4. Update checkout session in database
      await (supabase as any)
        .from('checkout_sessions')
        .update({
          checkout_status: waveSession.checkout_status,
          payment_status: waveSession.payment_status,
          transaction_id: waveSession.transaction_id,
          when_completed: waveSession.when_completed,
        })
        .eq('id', checkoutSession.id);

      // 5. Create the listing if payment is successful
      if (checkoutSession.checkout_status !== 'complete') {
        await createListing(checkoutSession.listing_data);
        setListingCreated(true);
      }

      setIsProcessing(false);
    } catch (err) {
      console.error('Error processing payment success:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setIsProcessing(false);
    }
  };

  const createListing = async (listingData: any) => {
    try {
      // Upload images to Supabase Storage
      const imageUrls: string[] = [];
      
      for (let i = 0; i < listingData.images.length; i++) {
        const file = listingData.images[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${i}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('listings')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('listings')
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
      }

      // Create listing in database
      const { error: insertError } = await supabase
        .from('listings')
        .insert({
          title: listingData.title,
          description: listingData.description,
          price: parseFloat(listingData.price),
          currency: 'XOF',
          location: listingData.location,
          condition: listingData.condition,
          phone: listingData.phone,
          category_id: listingData.category,
          subcategory_id: listingData.subcategory || null,
          user_id: user!.id,
          images: imageUrls,
          status: 'active',
        });

      if (insertError) throw insertError;
    } catch (err) {
      console.error('Error creating listing:', err);
      throw new Error('Erreur lors de la création de l\'annonce');
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-left">
              Traitement du paiement...
            </h1>
            <p className="text-gray-600 text-left">
              Nous vérifions votre paiement et créons votre annonce.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4 text-left">
              Erreur de traitement
            </h1>
            <p className="text-red-600 mb-6 text-left">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => navigate('/publier')}
                variant="outline"
              >
                Réessayer
              </Button>
              <Button
                onClick={() => navigate('/')}
                className="bg-red-600 hover:bg-red-700"
              >
                <Home className="w-4 h-4 mr-2" />
                Accueil
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-left">
            Paiement réussi !
          </h1>
          
          <p className="text-lg text-gray-600 mb-2 text-left">
            Votre paiement a été traité avec succès.
          </p>
          
          {listingCreated && (
            <p className="text-green-600 font-medium mb-6 text-left">
              Votre annonce a été publiée et est maintenant visible sur la plateforme.
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button
              onClick={() => navigate('/mes-annonces')}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <List className="w-4 h-4 mr-2" />
              Voir mes annonces
            </Button>
            
            <Button
              onClick={() => navigate('/annonces')}
              variant="outline"
            >
              Parcourir les annonces
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 text-left">
              <strong>Conseil :</strong> Vous recevrez des notifications lorsque des utilisateurs 
              s'intéresseront à votre annonce. Assurez-vous que vos informations de contact 
              sont à jour dans votre profil.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
