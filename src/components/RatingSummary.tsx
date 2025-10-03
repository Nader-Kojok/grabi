import { Star, StarHalf } from 'lucide-react'
import type { User } from '../types'

interface RatingSummaryProps {
  user: User
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
  className?: string
}

function RatingSummary({ 
  user, 
  size = 'md', 
  showCount = true,
  className = ''
}: Readonly<RatingSummaryProps>) {
  // If no rating yet, show appropriate message
  if (!user.sellerRating) {
    return (
      <div className={`flex items-center ${className}`}>
        <span className="text-gray-500 text-sm text-left">Aucune évaluation</span>
      </div>
    )
  }

  // Calculate full and half stars
  const rating = user.sellerRating
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  
  // Determine star size based on prop
  const starSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }
  
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }
  
  const starSize = starSizes[size]
  const textSize = textSizes[size]

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">
        {/* Render full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star 
            key={`full-${i}`} 
            className={`${starSize} fill-yellow-400 text-yellow-400`} 
          />
        ))}
        
        {/* Render half star if needed */}
        {hasHalfStar && (
          <StarHalf 
            className={`${starSize} fill-yellow-400 text-yellow-400`} 
          />
        )}
        
        {/* Render empty stars */}
        {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
          <Star 
            key={`empty-${i}`} 
            className={`${starSize} text-gray-300`} 
          />
        ))}
      </div>
      
      {/* Show rating count if requested */}
      {showCount && (
        <span className={`${textSize} text-gray-600 ml-1`}>
          ({user.reviewCount || 0})
        </span>
      )}
    </div>
  )
}

export default RatingSummary
