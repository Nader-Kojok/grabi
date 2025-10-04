import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, List } from 'lucide-react';
import { toast } from 'sonner';
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

  let sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Note: sessionId might be null, we'll handle this in processPaymentSuccess

    processPaymentSuccess();
  }, [user, sessionId, navigate]);

  const processPaymentSuccess = async () => {
    try {
      // Ensure we have valid user.id
      if (!user?.id) {
        throw new Error('Utilisateur non authentifié');
      }

      // 1. Get the checkout session from our database
      console.log('Looking for checkout session with:', { sessionId, userId: user.id });
      
      let checkoutSession = null;
      let dbError = null;

      if (sessionId) {
        // Try to find the session with the provided session ID
        const result = await (supabase as any)
          .from('checkout_sessions')
          .select('*')
          .eq('wave_session_id', sessionId)
          .eq('user_id', user.id)
          .maybeSingle();
        
        checkoutSession = result.data;
        dbError = result.error;
      }

      // If no session found with the provided ID, or no session ID provided,
      // find the most recent checkout session for this user
      if (!checkoutSession && !dbError) {
        console.log('No session found with provided ID, looking for most recent session for user');
        
        const result = await (supabase as any)
          .from('checkout_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('when_created', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        checkoutSession = result.data;
        dbError = result.error;
        
        if (checkoutSession) {
          console.log('Found most recent session:', checkoutSession.wave_session_id);
          // Update sessionId to use the found session
          sessionId = checkoutSession.wave_session_id;
        }
      }

      console.log('Database query result:', { checkoutSession, dbError });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error(`Erreur base de données: ${dbError.message}`);
      }

      if (!checkoutSession) {
        throw new Error('Aucune session de paiement trouvée pour cet utilisateur');
      }

      // 2. Verify payment status with Wave API
      if (!sessionId) {
        throw new Error('Session ID manquant après recherche');
      }
      
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
        const listingId = await createListing(checkoutSession.listing_data);
        setListingCreated(true);
        
        // 6. Update checkout session with listing_id
        if (listingId) {
          await (supabase as any)
            .from('checkout_sessions')
            .update({ listing_id: listingId })
            .eq('id', checkoutSession.id);
        }
      }

      setIsProcessing(false);
      toast.success('Annonce publiée avec succès !');
    } catch (err) {
      console.error('Error processing payment success:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error(errorMessage);
      setIsProcessing(false);
    }
  };

  const createListing = async (listingData: any) => {
    try {
      console.log('Creating listing with data:', listingData);
      
      // Check if images exist and are valid
      if (!listingData.images || !Array.isArray(listingData.images)) {
        throw new Error('Aucune image trouvée dans les données de l\'annonce');
      }

      // Images are already uploaded and we have URLs
      const imageUrls = listingData.images;
      console.log('Using pre-uploaded images:', imageUrls);

      // Create listing in database
      const { data: newListing, error: insertError } = await supabase
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
        })
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }
      
      console.log('Listing created successfully:', newListing?.id);
      return newListing?.id;
    } catch (err) {
      console.error('Error creating listing:', err);
      throw new Error('Erreur lors de la création de l\'annonce');
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8 sm:py-16 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">
                Traitement du paiement...
              </h1>
              <p className="text-sm sm:text-base text-gray-600 text-center">
                Nous vérifions votre paiement et créons votre annonce.
              </p>
            </div>
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
        <div className="container mx-auto px-4 py-8 sm:py-16 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Erreur de traitement
              </h1>
              <p className="text-sm sm:text-base text-red-600 mb-6">{error}</p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button
                  onClick={() => navigate('/publier')}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Réessayer
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Accueil
                </Button>
              </div>
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
      
      <div className="container mx-auto px-4 py-8 sm:py-16 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          {/* Success Icon */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 sm:w-12 h-10 sm:h-12 text-green-600" />
            </div>

            {/* Success Message */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Paiement réussi !
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 mb-2">
              Votre paiement a été traité avec succès.
            </p>
            
            {listingCreated && (
              <p className="text-sm sm:text-base text-green-600 font-medium mb-6">
                Votre annonce a été publiée et est maintenant visible sur la plateforme.
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-8">
              <Button
                onClick={() => navigate('/mes-annonces')}
                className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
              >
                <List className="w-4 h-4 mr-2" />
                Voir mes annonces
              </Button>
              
              <Button
                onClick={() => navigate('/annonces')}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Parcourir les annonces
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg w-full">
              <p className="text-xs sm:text-sm text-blue-800 text-left">
                <strong>Conseil :</strong> Vous recevrez des notifications lorsque des utilisateurs 
                s'intéresseront à votre annonce. Assurez-vous que vos informations de contact 
                sont à jour dans votre profil.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
