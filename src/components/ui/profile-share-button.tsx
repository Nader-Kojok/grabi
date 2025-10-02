import React, { useState } from 'react';
import type { User } from '../../types';
import { shareProfile } from '../../utils/profileUtils';
import { Button } from './button';

interface ProfileShareButtonProps {
  user: User;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export const ProfileShareButton: React.FC<ProfileShareButtonProps> = ({
  user,
  size = 'default',
  className = ''
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      const success = await shareProfile(user);
      
      if (success) {
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }
    } catch (error) {
      console.error('Failed to share profile:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={handleShare}
        disabled={isSharing}
        variant="default"
        size={size}
        className={`${className} ${showCopied ? '!bg-green-600 !border-green-600 !text-white hover:!bg-green-700' : '!bg-white !border-white !text-gray-900 hover:!bg-gray-100'} !opacity-100 shadow-lg`}
      >
        {isSharing ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Partage...
          </>
        ) : showCopied ? (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copié !
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            Partager le profil
          </>
        )}
      </Button>
    </div>
  );
};