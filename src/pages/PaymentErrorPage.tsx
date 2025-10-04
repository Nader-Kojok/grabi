import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { waveService } from '../services/waveService';
import { useAuthStore } from '../stores/authStore';

const PaymentErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState<{
    title: string;
    message: string;
    canRetry: boolean;
  }>({
    title: 'Erreur de paiement',
    message: 'Une erreur est survenue lors du traitement de votre paiement.',
    canRetry: true,
  });

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!sessionId) {
      setErrorDetails({
        title: 'Session invalide',
        message: 'Aucune session de paiement trouvée.',
        canRetry: false,
      });
      setIsLoading(false);
      return;
    }

    checkPaymentStatus();
  }, [user, sessionId, navigate]);

  const checkPaymentStatus = async () => {
    try {
      // Ensure we have valid sessionId and user.id
      if (!sessionId || !user?.id) {
        setErrorDetails({
          title: 'Données manquantes',
          message: 'Informations de session ou d\'utilisateur manquantes.',
          canRetry: false,
        });
        setIsLoading(false);
        return;
      }

      // Get the checkout session from our database
      console.log('Looking for checkout session with:', { sessionId, userId: user.id });
      
      const { data: checkoutSession, error: dbError } = await (supabase as any)
        .from('checkout_sessions')
        .select('*')
        .eq('wave_session_id', sessionId)
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('Database query result:', { checkoutSession, dbError });

      if (dbError || !checkoutSession) {
        console.error('Session lookup failed:', { dbError, sessionId, userId: user.id });
        setErrorDetails({
          title: 'Session introuvable',
          message: `La session de paiement n'a pas été trouvée dans notre système. Session ID: ${sessionId}`,
          canRetry: false,
        });
        setIsLoading(false);
        return;
      }

      // Check status with Wave API
      const waveResponse = await waveService.getCheckoutSession(sessionId);
      
      if (waveResponse.success && waveResponse.data) {
        const waveSession = waveResponse.data;
        
        // Update our database with the latest status
        await (supabase as any)
          .from('checkout_sessions')
          .update({
            checkout_status: waveSession.checkout_status,
            payment_status: waveSession.payment_status,
            transaction_id: waveSession.transaction_id,
          })
          .eq('id', checkoutSession.id);

        // Determine error type based on Wave response
        if (waveSession.checkout_status === 'expired') {
          setErrorDetails({
            title: 'Session expirée',
            message: 'Votre session de paiement a expiré. Veuillez créer une nouvelle annonce.',
            canRetry: true,
          });
        } else if (waveSession.payment_status === 'cancelled') {
          setErrorDetails({
            title: 'Paiement annulé',
            message: 'Vous avez annulé le paiement. Aucun montant n\'a été débité.',
            canRetry: true,
          });
        } else if (waveSession.last_payment_error) {
          setErrorDetails({
            title: 'Erreur de paiement',
            message: waveSession.last_payment_error.message || 'Une erreur est survenue lors du paiement.',
            canRetry: true,
          });
        }
      } else {
        setErrorDetails({
          title: 'Vérification impossible',
          message: 'Impossible de vérifier le statut de votre paiement. Veuillez contacter le support.',
          canRetry: false,
        });
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
      setErrorDetails({
        title: 'Erreur système',
        message: 'Une erreur technique est survenue. Veuillez réessayer plus tard.',
        canRetry: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    navigate('/publier');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8 sm:py-16 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">
                Vérification du paiement...
              </h1>
              <p className="text-sm sm:text-base text-gray-600 text-center">
                Nous vérifions le statut de votre paiement.
              </p>
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
          {/* Error Icon */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-10 sm:w-12 h-10 sm:h-12 text-red-600" />
            </div>

            {/* Error Message */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              {errorDetails.title}
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 mb-6">
              {errorDetails.message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {errorDetails.canRetry && (
              <Button
                onClick={handleRetry}
                className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Réessayer
              </Button>
            )}
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>

          {/* Help Section */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-left">
              Besoin d'aide ?
            </h3>
            
            <div className="space-y-3 text-sm text-gray-600">
              <p className="text-left">
                <strong>Problème de connexion :</strong> Vérifiez votre connexion internet et réessayez.
              </p>
              
              <p className="text-left">
                <strong>Problème de paiement :</strong> Assurez-vous que votre compte Wave a suffisamment de fonds.
              </p>
              
              <p className="text-left">
                <strong>Session expirée :</strong> Les sessions de paiement expirent après 30 minutes d'inactivité.
              </p>
              
              <p className="text-left">
                <strong>Autres problèmes :</strong> Contactez notre support à l'adresse{' '}
                <a href="mailto:support@grabi.sn" className="text-red-600 hover:underline">
                  support@grabi.sn
                </a>
              </p>
            </div>
          </div>

          {/* Session Info */}
          {sessionId && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 text-left">
                <strong>ID de session :</strong> {sessionId}
              </p>
              <p className="text-xs text-blue-600 mt-1 text-left">
                Conservez cet ID si vous contactez le support.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentErrorPage;
