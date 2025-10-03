import type { User } from '../types';

/**
 * Calculate profile completion percentage based on filled fields
 */
export const calculateProfileCompletion = (user: User): number => {
  if (!user) return 0;

  const fields = [
    user.name,
    user.email,
    user.phone,
    user.bio,
    user.location,
    user.dateOfBirth,
    user.website,
    user.avatar,
    user.bannerUrl,
    user.socialLinks && Object.keys(user.socialLinks).length > 0 ? 'socialLinks' : null
  ];

  const filledFields = fields.filter(field => field && field.toString().trim() !== '').length;
  const totalFields = fields.length;

  return Math.round((filledFields / totalFields) * 100);
};

/**
 * Get profile completion status and suggestions
 */
export const getProfileCompletionStatus = (user: User) => {
  const percentage = calculateProfileCompletion(user);
  const missingFields: string[] = [];

  if (!user.phone) missingFields.push('Téléphone');
  if (!user.bio) missingFields.push('Biographie');
  if (!user.location) missingFields.push('Localisation');
  if (!user.dateOfBirth) missingFields.push('Date de naissance');
  if (!user.website) missingFields.push('Site web');
  if (!user.avatar) missingFields.push('Photo de profil');
  if (!user.bannerUrl) missingFields.push('Bannière');
  if (!user.socialLinks || Object.keys(user.socialLinks).length === 0) {
    missingFields.push('Liens sociaux');
  }

  let status: 'incomplet' | 'bon' | 'excellent' = 'incomplet';
let message = '';

if (percentage < 50) {
  status = 'incomplet';
  message = 'Complétez votre profil pour attirer plus de clients';
} else if (percentage < 80) {
  status = 'bon';
  message = 'Beau progrès ! Ajoutez encore quelques détails';
} else {
  status = 'excellent';
  message = 'Excellent ! Votre profil est complet';
}


  return {
    percentage,
    status,
    message,
    missingFields: missingFields.slice(0, 3) // Show only top 3 missing fields
  };
};

/**
 * Generate shareable profile URL
 */
export const generateProfileShareUrl = (userId: string): string => {
  const baseUrl = window.location.origin;
  // Always use the user ID for the URL to ensure it works correctly
  return `${baseUrl}/profile/${userId}`;
};

/**
 * Copy profile URL to clipboard
 */
export const copyProfileUrl = async (userId: string): Promise<boolean> => {
  try {
    const url = generateProfileShareUrl(userId);
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('Failed to copy profile URL:', error);
    return false;
  }
};

/**
 * Share profile via Web Share API or fallback to copy
 */
export const shareProfile = async (user: User): Promise<boolean> => {
  const url = generateProfileShareUrl(user.id);
  const title = `${user.name}'s Profile - Grabi`;
  const text = `Check out ${user.name}'s profile on Grabi marketplace`;

  // Try Web Share API first (mobile devices)
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url
      });
      return true;
    } catch {
      // User cancelled or error occurred, fallback to copy
    }
  }

  // Fallback to copying URL
  return await copyProfileUrl(user.id);
};

export const getVerificationBadges = (user: User): Array<{ type: string; label: string; color: string; icon: string }> => {
  const badges = [];

  // Check if user is verified
  if (user.isVerified) {
    badges.push({
      type: 'verified',
      label: 'Vérifié',
      color: 'bg-blue-100 text-blue-800',
      icon: '✓'
    });
  }

  // Check verification badges array
  if (user.verificationBadges && user.verificationBadges.length > 0) {
    user.verificationBadges.forEach(badge => {
      switch (badge) {
        case 'business':
          badges.push({
            type: 'business',
            label: 'Entreprise',
            color: 'bg-green-100 text-green-800',
            icon: '🏢'
          });
          break;
        case 'plus':
          badges.push({
            type: 'plus',
            label: 'Plus',
            color: 'bg-purple-100 text-purple-800',
            icon: '★'
          });
          break;
      }
    });
  }

  return badges;
};