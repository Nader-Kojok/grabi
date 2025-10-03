import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings, 
  Shield, 
  Bell, 
  CreditCard, 
  Eye, 
  EyeOff, 
  Lock, 
  Trash2, 
  Globe, 
  Moon, 
  Sun,
  Save,
  Mail,
  Smartphone,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuthStore } from '../stores/authStore';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Security Settings
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newMessages: true,
    announceUpdates: true,
    marketingEmails: false
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    language: 'fr',
    theme: 'light',
    currency: 'EUR'
  });

  useEffect(() => {
    // Load user preferences from localStorage or API
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }

    const savedNotifications = localStorage.getItem('notificationSettings');
    if (savedNotifications) {
      setNotificationSettings(JSON.parse(savedNotifications));
    }
  }, []);

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // TODO: Implement password change logic with Supabase
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setMessage({ type: 'success', text: 'Mot de passe modifié avec succès!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ type: 'error', text: 'Erreur lors du changement de mot de passe' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationSave = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    setMessage({ type: 'success', text: 'Préférences de notification enregistrées!' });
  };

  const handlePreferencesSave = () => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    setMessage({ type: 'success', text: 'Préférences enregistrées!' });
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.'
    );

    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      'Dernière confirmation : Toutes vos données seront définitivement supprimées. Continuer ?'
    );

    if (!doubleConfirm) return;

    try {
      // TODO: Implement account deletion logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la suppression du compte' });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">Vous devez être connecté pour accéder aux paramètres.</p>
            <Button onClick={() => navigate('/login')} className="mt-4 bg-red-600 hover:bg-red-700">
              Se connecter
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 hover:bg-white transition-colors border-gray-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>

        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 text-left">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <Settings className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 text-left">Paramètres</h1>
              <p className="text-gray-600 mt-1">Gérez vos préférences et paramètres de compte</p>
            </div>
          </div>

          {/* Success/Error Messages */}
          {message && (
            <div className="mt-6">
              <div className={`p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.text}
              </div>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Security & Privacy Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-left">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-red-50 rounded-lg">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 text-left">Sécurité et confidentialité</h2>
              </div>

              {/* Change Password Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left">Changer le mot de passe</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-900">
                        Mot de passe actuel
                      </label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          placeholder="Entrez votre mot de passe actuel"
                          className="border-gray-300 focus:border-red-500 focus:ring-red-500 bg-white shadow-sm h-12 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-900">
                        Nouveau mot de passe
                      </label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          placeholder="Entrez votre nouveau mot de passe"
                          className="border-gray-300 focus:border-red-500 focus:ring-red-500 bg-white shadow-sm h-12 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900">
                        Confirmer le nouveau mot de passe
                      </label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirmez votre nouveau mot de passe"
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500 bg-white shadow-sm h-12"
                      />
                    </div>

                    <Button
                      onClick={handlePasswordChange}
                      disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                      className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      {isLoading ? 'Modification...' : 'Changer le mot de passe'}
                    </Button>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left">Confidentialité</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <Eye className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Profil public</p>
                          <p className="text-sm text-gray-600">Votre profil est visible par tous</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-left">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 text-left">Notifications</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left">Canaux de notification</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Notifications par email</p>
                          <p className="text-sm text-gray-600">Recevoir des emails de notification</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Notifications push</p>
                          <p className="text-sm text-gray-600">Recevoir des notifications sur votre appareil</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationSettings.pushNotifications}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Notifications SMS</p>
                          <p className="text-sm text-gray-600">Recevoir des SMS pour les alertes importantes</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationSettings.smsNotifications}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left">Préférences de notification</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <p className="font-medium text-gray-900">Nouveaux messages</p>
                        <p className="text-sm text-gray-600">Être notifié des nouveaux messages</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationSettings.newMessages}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, newMessages: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <p className="font-medium text-gray-900">Mises à jour d'annonces</p>
                        <p className="text-sm text-gray-600">Être notifié des changements sur vos annonces</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationSettings.announceUpdates}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, announceUpdates: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <p className="font-medium text-gray-900">Emails marketing</p>
                        <p className="text-sm text-gray-600">Recevoir des offres et promotions</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={notificationSettings.marketingEmails}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, marketingEmails: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleNotificationSave}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Enregistrer les préférences
                </Button>
              </div>
            </div>

            {/* Preferences Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Globe className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 text-left">Préférences</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label htmlFor="language" className="block text-sm font-semibold text-gray-900 text-left">
                    Langue
                  </label>
                  <select
                    id="language"
                    value={preferences.language}
                    onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label htmlFor="theme" className="block text-sm font-semibold text-gray-900 text-left">
                    Thème
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, theme: 'light' }))}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                        preferences.theme === 'light' 
                          ? 'border-purple-600 bg-purple-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Sun className="h-6 w-6" />
                      <span className="text-sm font-medium">Clair</span>
                    </button>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, theme: 'dark' }))}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                        preferences.theme === 'dark' 
                          ? 'border-purple-600 bg-purple-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Moon className="h-6 w-6" />
                      <span className="text-sm font-medium">Sombre</span>
                    </button>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, theme: 'auto' }))}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                        preferences.theme === 'auto' 
                          ? 'border-purple-600 bg-purple-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Settings className="h-6 w-6" />
                      <span className="text-sm font-medium">Auto</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="currency" className="block text-sm font-semibold text-gray-900 text-left">
                    Devise
                  </label>
                  <select
                    id="currency"
                    value={preferences.currency}
                    onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="MAD">MAD (DH)</option>
                  </select>
                </div>

                <Button
                  onClick={handlePreferencesSave}
                  className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Enregistrer les préférences
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Settings className="h-5 w-5 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-left">Compte</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Membre depuis</p>
                  <p className="font-medium text-gray-900">
                    {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Billing Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-sm border border-green-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500 rounded-lg">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-left">Facturation</h3>
              </div>
              
              <p className="text-sm text-gray-700 mb-4">
                Gérez vos méthodes de paiement et consultez votre historique de facturation.
              </p>
              
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Gérer la facturation
              </Button>
            </div>

            {/* Danger Zone Card */}
            <div className="bg-red-50 rounded-2xl shadow-sm border border-red-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-left">Zone dangereuse</h3>
              </div>
              
              <p className="text-sm text-gray-700 mb-4">
                La suppression de votre compte est irréversible. Toutes vos données seront définitivement perdues.
              </p>
              
              <Button
                onClick={handleDeleteAccount}
                variant="outline"
                className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer mon compte
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SettingsPage;