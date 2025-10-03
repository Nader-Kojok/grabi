import React from 'react';
import type { User } from '../../types';
import { getProfileCompletionStatus } from '../../utils/profileUtils';

interface ProfileCompletionIndicatorProps {
  user: User;
  className?: string;
}

export const ProfileCompletionIndicator: React.FC<ProfileCompletionIndicatorProps> = ({
  user,
  className = ''
}) => {
  const { percentage, status, message, missingFields } = getProfileCompletionStatus(user);

  const getStatusColor = () => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'bon':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-orange-600 bg-orange-100';
    }
  };

  const getProgressColor = () => {
    switch (status) {
      case 'excellent':
        return 'bg-green-500';
      case 'bon':
        return 'bg-blue-500';
      default:
        return 'bg-orange-500';
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 text-left">Progression du profil</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-sm text-gray-600 mb-3">{message}</p>

      {missingFields.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Champs manquants :</p>
          <ul className="space-y-1">
            {missingFields.map((field, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
                {field}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};