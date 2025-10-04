import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  FileText,
  ArrowLeft,
  Download,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../utils/currency';

interface PaymentTransaction {
  id: string;
  wave_session_id: string;
  amount: number;
  currency: string;
  checkout_status: 'open' | 'complete' | 'expired';
  payment_status?: 'processing' | 'cancelled' | 'succeeded';
  transaction_id?: string;
  listing_id?: string;
  listing_data: {
    title: string;
    description: string;
    price: string;
  };
  when_created: string;
  when_completed?: string;
  when_expires: string;
}

const PaymentHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchPaymentHistory();
  }, [user, navigate]);

  const fetchPaymentHistory = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await (supabase as any)
        .from('checkout_sessions')
        .select('*')
        .eq('user_id', user!.id)
        .order('when_created', { ascending: false });

      if (error) {
        console.error('Error fetching payment history:', error);
        setError('Erreur lors du chargement de l\'historique des paiements');
        toast.error('Erreur lors du chargement de l\'historique des paiements');
        return;
      }

      setTransactions(data || []);
    } catch (err) {
      console.error('Error:', err);
      setError('Une erreur est survenue');
      toast.error('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (transaction: PaymentTransaction) => {
    if (transaction.payment_status === 'succeeded' && transaction.checkout_status === 'complete') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (transaction.payment_status === 'cancelled' || transaction.checkout_status === 'expired') {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    return <Clock className="h-5 w-5 text-yellow-500" />;
  };

  const getStatusText = (transaction: PaymentTransaction) => {
    if (transaction.payment_status === 'succeeded' && transaction.checkout_status === 'complete') {
      return 'Payé';
    }
    if (transaction.payment_status === 'cancelled') {
      return 'Annulé';
    }
    if (transaction.checkout_status === 'expired') {
      return 'Expiré';
    }
    if (transaction.payment_status === 'processing') {
      return 'En cours';
    }
    return 'En attente';
  };

  const getStatusColor = (transaction: PaymentTransaction) => {
    if (transaction.payment_status === 'succeeded' && transaction.checkout_status === 'complete') {
      return 'text-green-600 bg-green-50';
    }
    if (transaction.payment_status === 'cancelled' || transaction.checkout_status === 'expired') {
      return 'text-red-600 bg-red-50';
    }
    return 'text-yellow-600 bg-yellow-50';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const viewTransactionDetails = (transaction: PaymentTransaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const downloadReceipt = (transaction: PaymentTransaction) => {
    // Create a simple receipt HTML
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reçu de paiement - ${transaction.wave_session_id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #dc2626;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #dc2626;
            margin: 0;
          }
          .info-section {
            margin: 20px 0;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }
          .info-label {
            font-weight: bold;
            color: #666;
          }
          .info-value {
            text-align: right;
          }
          .total {
            font-size: 24px;
            font-weight: bold;
            color: #dc2626;
            text-align: right;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #333;
          }
          .status {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            background-color: #dcfce7;
            color: #166534;
            font-weight: bold;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>GRABI</h1>
          <p>Reçu de paiement</p>
        </div>
        
        <div class="info-section">
          <div class="info-row">
            <span class="info-label">ID de transaction</span>
            <span class="info-value">${transaction.transaction_id || transaction.wave_session_id}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Date</span>
            <span class="info-value">${formatDate(transaction.when_created)}</span>
          </div>
          ${transaction.when_completed ? `
          <div class="info-row">
            <span class="info-label">Date de paiement</span>
            <span class="info-value">${formatDate(transaction.when_completed)}</span>
          </div>
          ` : ''}
          <div class="info-row">
            <span class="info-label">Description</span>
            <span class="info-value">${transaction.listing_data?.title || 'Publication d\'annonce'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Statut</span>
            <span class="info-value"><span class="status">${getStatusText(transaction)}</span></span>
          </div>
        </div>
        
        <div class="total">
          Total: ${formatCurrency(transaction.amount)}
        </div>
        
        <div class="footer">
          <p>Merci d'avoir utilisé GRABI</p>
          <p>Ce reçu a été généré automatiquement le ${new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </body>
      </html>
    `;

    // Create a blob and download
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `recu-${transaction.wave_session_id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Reçu téléchargé avec succès');
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
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-left">
                Historique des paiements
              </h1>
              <p className="mt-1 text-sm text-gray-600 text-left">
                Consultez tous vos paiements et transactions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CreditCard className="h-5 w-5" />
            <span>{transactions.length} transaction{transactions.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement de l'historique...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <XCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && transactions.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <CreditCard className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Aucun paiement</h3>
            <p className="mt-2 text-sm text-gray-500">
              Vous n'avez effectué aucun paiement pour le moment.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => navigate('/publier')}
                className="bg-red-600 hover:bg-red-700"
              >
                Publier une annonce
              </Button>
            </div>
          </div>
        )}

        {/* Summary Stats - Show FIRST for better UX */}
        {!isLoading && transactions.length > 0 && (
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate text-left">
                        Paiements réussis
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 text-left">
                        {transactions.filter(t => t.payment_status === 'succeeded').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate text-left">
                        En attente
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 text-left">
                        {transactions.filter(t => t.payment_status === 'processing' || (!t.payment_status && t.checkout_status === 'open')).length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate text-left">
                        Total payé
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 text-left">
                        {formatCurrency(
                          transactions
                            .filter(t => t.payment_status === 'succeeded')
                            .reduce((sum, t) => sum + t.amount, 0)
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions List */}
        {!isLoading && transactions.length > 0 && (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <li key={transaction.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    {/* Mobile-first layout */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Left section - Status and Info */}
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(transaction)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 text-left truncate">
                              {transaction.listing_data?.title || 'Publication d\'annonce'}
                            </p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction)} w-fit`}>
                              {getStatusText(transaction)}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 text-sm text-gray-500">
                            <p className="text-left">
                              {formatDate(transaction.when_created)}
                            </p>
                            {transaction.transaction_id && (
                              <>
                                <span className="hidden sm:inline mx-2">•</span>
                                <p className="text-left text-xs sm:text-sm">ID: {transaction.transaction_id}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Right section - Price and Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-4">
                        <div className="text-left sm:text-right">
                          <p className="text-sm sm:text-base font-medium text-gray-900">
                            {formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[150px] sm:max-w-none">
                            Session: {transaction.wave_session_id.slice(0, 8)}...
                          </p>
                        </div>
                        
                        <div className="flex gap-2 flex-shrink-0">
                          {transaction.listing_id && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/product/${transaction.listing_id}`)}
                              title="Voir l'annonce"
                              className="h-8 w-8 p-0"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewTransactionDetails(transaction)}
                            title="Voir les détails"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {transaction.payment_status === 'succeeded' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadReceipt(transaction)}
                              title="Télécharger le reçu"
                              className="h-8 w-8 p-0"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la transaction</DialogTitle>
            <DialogDescription>
              Informations complètes sur votre transaction
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                {getStatusIcon(selectedTransaction)}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTransaction)}`}>
                  {getStatusText(selectedTransaction)}
                </span>
              </div>

              {/* Transaction Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1 text-left">Description</h3>
                  <p className="text-base text-gray-900 text-left">
                    {selectedTransaction.listing_data?.title || 'Publication d\'annonce'}
                  </p>
                  {selectedTransaction.listing_data?.description && (
                    <p className="text-sm text-gray-600 mt-1 text-left">
                      {selectedTransaction.listing_data.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1 text-left">Montant</h3>
                    <p className="text-lg font-medium text-red-600 text-left">
                      {formatCurrency(selectedTransaction.amount)}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1 text-left">Devise</h3>
                    <p className="text-base text-gray-900 text-left">{selectedTransaction.currency}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1 text-left">ID de session Wave</h3>
                  <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded text-left break-all">
                    {selectedTransaction.wave_session_id}
                  </p>
                </div>

                {selectedTransaction.transaction_id && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1 text-left">ID de transaction</h3>
                    <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded text-left break-all">
                      {selectedTransaction.transaction_id}
                    </p>
                  </div>
                )}

                {selectedTransaction.listing_id && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1 text-left">Annonce associée</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded text-left break-all flex-1">
                        {selectedTransaction.listing_id}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowDetailsModal(false);
                          navigate(`/product/${selectedTransaction.listing_id}`);
                        }}
                        className="flex-shrink-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1 text-left">Date de création</h3>
                    <p className="text-sm text-gray-900 text-left">
                      {formatDate(selectedTransaction.when_created)}
                    </p>
                  </div>

                  {selectedTransaction.when_completed && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-1 text-left">Date de paiement</h3>
                      <p className="text-sm text-gray-900 text-left">
                        {formatDate(selectedTransaction.when_completed)}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-1 text-left">Date d'expiration</h3>
                  <p className="text-sm text-gray-900 text-left">
                    {formatDate(selectedTransaction.when_expires)}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1 text-left">Statut de paiement</h3>
                    <p className="text-sm text-gray-900 text-left">
                      {selectedTransaction.payment_status || 'Non défini'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1 text-left">Statut de checkout</h3>
                    <p className="text-sm text-gray-900 text-left">
                      {selectedTransaction.checkout_status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedTransaction?.listing_id && (
              <Button
                onClick={() => {
                  setShowDetailsModal(false);
                  navigate(`/product/${selectedTransaction.listing_id}`);
                }}
                className="bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Voir l'annonce
              </Button>
            )}
            {selectedTransaction?.payment_status === 'succeeded' && (
              <Button
                onClick={() => downloadReceipt(selectedTransaction)}
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Télécharger le reçu
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setShowDetailsModal(false)}
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default PaymentHistoryPage;
