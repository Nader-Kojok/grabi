import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Save, X, UserCircle, Phone, MapPin, Calendar, Mail, Settings, Shield, Bell, CreditCard, Activity, Link } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { FileUpload } from '../components/ui/file-upload';
import { SocialLinksManager } from '../components/ui/social-links-manager';
import { ProfileCompletionIndicator } from '../components/ui/profile-completion-indicator';
import { VerificationBadges } from '../components/ui/verification-badges';
import { ProfileShareButton } from '../components/ui/profile-share-button';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuthStore } from '../stores/authStore';
import { uploadAvatar, uploadBanner } from '../utils/storage';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    website: '',
    dateOfBirth: '',
    socialLinks: {} as Record<string, string>
  });

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [tempAvatar, setTempAvatar] = useState<string>('');
  const [tempBanner, setTempBanner] = useState<string>('');

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    
    setUploadingAvatar(true);
    try {
      const result = await uploadAvatar(file, user.id);
      setTempAvatar(result.url);
      
      // Update user immediately
      await updateUser({
        avatar: result.url
      });
      
      setMessage({ type: 'success', text: 'Avatar mis à jour avec succès!' });
    } catch (error) {
      console.error('Avatar upload error:', error);
      setMessage({ type: 'error', text: 'Erreur lors du téléchargement de l\'avatar' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleBannerUpload = async (file: File) => {
    if (!user) return;
    
    setUploadingBanner(true);
    try {
      const result = await uploadBanner(file, user.id);
      setTempBanner(result.url);
      
      // Update user immediately
      await updateUser({
        bannerUrl: result.url
      });
      
      setMessage({ type: 'success', text: 'Bannière mise à jour avec succès!' });
    } catch (error) {
      console.error('Banner upload error:', error);
      setMessage({ type: 'error', text: 'Erreur lors du téléchargement de la bannière' });
    } finally {
      setUploadingBanner(false);
    }
  };

  useEffect(() => {
    if (user) {
      const nameParts = user.name?.split(' ') || ['', ''];
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        website: user.website || '',
        dateOfBirth: user.dateOfBirth || '',
        socialLinks: user.socialLinks || {}
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialLinksChange = (socialLinks: Record<string, string>) => {
    setFormData(prev => ({ ...prev, socialLinks }));
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      await updateUser({
        name: fullName,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        dateOfBirth: formData.dateOfBirth,
        socialLinks: formData.socialLinks
      });
      
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      const nameParts = user.name?.split(' ') || ['', ''];
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        website: user.website || '',
        dateOfBirth: user.dateOfBirth || '',
        socialLinks: user.socialLinks || {}
      });
    }
    setIsEditing(false);
    setMessage(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">Vous devez être connecté pour voir votre profil.</p>
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
            {user.bannerUrl || tempBanner ? (
              <img 
                src={tempBanner || user.bannerUrl} 
                alt="Profile Banner" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full bg-gradient-to-r from-red-500 to-red-600"></div>
            )}
            
            {/* Dark gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            {isEditing && (
              <div className="absolute top-4 right-4 z-20">
                <FileUpload
                  onFileSelect={handleBannerUpload}
                  type="banner"
                  placeholder={uploadingBanner ? "Téléchargement..." : "Changer la bannière"}
                  className="bg-black bg-opacity-50 text-white border-white hover:bg-opacity-70"
                />
              </div>
            )}
            
            {/* User Info Overlay - Positioned over banner */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                {/* Avatar */}
                <div className="relative z-10">
                  {isEditing ? (
                    <FileUpload
                      onFileSelect={handleAvatarUpload}
                      currentImage={tempAvatar || (user.avatar && user.avatar.trim() !== '' ? user.avatar : undefined)}
                      type="avatar"
                      placeholder={uploadingAvatar ? "Téléchargement..." : "Changer l'avatar"}
                      className="w-40 h-40 rounded-full shadow-xl ring-4 ring-white"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full  shadow-xl ring-4 ring-white">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                          <UserCircle className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* User Information */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold text-white drop-shadow-lg">{user.name}</h1>
                      <VerificationBadges user={user} size="lg" />
                    </div>
                  </div>
                  <p className="text-white/90 flex items-center gap-2 mb-3 drop-shadow-md">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </p>
                  
                  {/* Profile Stats */}
                  <div className="flex flex-wrap gap-6 text-sm text-white/80 drop-shadow-md">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Membre depuis {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="h-4 w-4" />
                      <span>Actif récemment</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 mt-4 sm:mt-0">
                  {!isEditing ? (
                    <>
                      <ProfileShareButton user={user} className="shadow-lg border-2 border-white/20" />
                      <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 shadow-lg border-2 border-white/20">
                        <Edit className="h-4 w-4" />
                        Modifier le profil
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 shadow-lg border-2 border-white/20">
                        <Save className="h-4 w-4" />
                        {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                      </Button>
                      <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2 bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                        <X className="h-4 w-4" />
                        Annuler
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Success/Error Messages - Only show container when there's a message */}
          {message && (
            <div className="px-8 pb-8 pt-6">
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
          {/* Personal Information Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-red-50 rounded-lg">
                  <UserCircle className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900 text-left">Prénom</label>
                  {isEditing ? (
                    <Input
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Votre prénom"
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500 bg-white shadow-sm h-12"
                    />
                  ) : (
                    <div className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[48px] flex items-center">
                      {formData.firstName || 'Non renseigné'}
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900 text-left">Nom</label>
                  {isEditing ? (
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Votre nom"
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500 bg-white shadow-sm h-12"
                    />
                  ) : (
                    <div className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[48px] flex items-center">
                      {formData.lastName || 'Non renseigné'}
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900 text-left">Email</label>
                  <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg text-gray-600 border border-gray-200 min-h-[48px]">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900">{formData.email}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900 text-left">Téléphone</label>
                  {isEditing ? (
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Votre numéro de téléphone"
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500 bg-white shadow-sm h-12"
                    />
                  ) : (
                    <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg text-gray-900 border border-gray-200 min-h-[48px]">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{formData.phone || 'Non renseigné'}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-900 text-left">Localisation</label>
                  {isEditing ? (
                    <Input
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Votre ville"
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500 bg-white shadow-sm h-12"
                    />
                  ) : (
                    <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg text-gray-900 border border-gray-200 min-h-[48px]">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{formData.location || 'Non renseigné'}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900 text-left">Site web</label>
                  {isEditing ? (
                    <Input
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://votre-site.com"
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500 bg-white shadow-sm h-12"
                    />
                  ) : (
                    <div className="py-3 px-4 bg-gray-50 rounded-lg text-gray-900 border border-gray-200 min-h-[48px] flex items-center">
                      {formData.website ? (
                        <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 underline">
                          {formData.website}
                        </a>
                      ) : (
                        'Non renseigné'
                      )}
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900 text-left">Date de naissance</label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500 bg-white shadow-sm h-12"
                    />
                  ) : (
                    <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg text-gray-900 border border-gray-200 min-h-[48px]">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString('fr-FR') : 'Non renseigné'}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 space-y-3">
                <label className="block text-sm font-semibold text-gray-900 text-left">Bio</label>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Parlez-nous de vous..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none bg-white shadow-sm"
                    rows={4}
                  />
                ) : (
                  <div className="py-4 px-4 bg-gray-50 rounded-lg text-gray-900 min-h-[120px] border border-gray-200">
                    {formData.bio || 'Aucune bio renseignée'}
                  </div>
                )}
              </div>

              {/* Social Links Section */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Link className="h-5 w-5 text-blue-600" />
                  </div>
                  <label className="block text-sm font-semibold text-gray-900">Liens sociaux</label>
                </div>
                <SocialLinksManager
                   socialLinks={formData.socialLinks}
                   onUpdate={handleSocialLinksChange}
                   isEditing={isEditing}
                 />
              </div>
            </div>
          </div>

          {/* Sidebar Cards */}
          <div className="space-y-6">
            {/* Profile Completion Indicator */}
            <ProfileCompletionIndicator user={user} />
            
            {/* Account Settings Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Settings className="h-5 w-5 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Paramètres</h3>
              </div>
              
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                  <Shield className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700 font-medium">Sécurité et confidentialité</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700 font-medium">Notifications</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700 font-medium">Facturation</span>
                </button>
              </div>
            </div>

            {/* Activity Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Activité</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Annonces publiées</span>
                  <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full text-sm">0</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Messages envoyés</span>
                  <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full text-sm">0</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Favoris</span>
                  <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full text-sm">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;