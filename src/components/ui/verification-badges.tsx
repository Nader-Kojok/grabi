import React from 'react';
import type { User } from '../../types';
import { getVerificationBadges } from '../../utils/profileUtils';

interface VerificationBadgesProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VerificationBadges: React.FC<VerificationBadgesProps> = ({
  user,
  size = 'md',
  className = ''
}) => {
  const badges = getVerificationBadges(user);

  if (badges.length === 0) {
    return null;
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'lg':
        return 'text-sm px-3 py-2';
      default:
        return 'text-xs px-2.5 py-1.5';
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges.map((badge, index) => (
        <div
          key={index}
          className={`
            inline-flex items-center rounded-full font-medium
            ${badge.color} ${getSizeClasses()}
          `}
          title={badge.label}
        >
          <span className="mr-1">{badge.icon}</span>
          {size === 'lg' && <span>{badge.label}</span>}
          {size === 'md' && <span className="hidden sm:inline">{badge.label}</span>}
        </div>
      ))}
    </div>
  );
};