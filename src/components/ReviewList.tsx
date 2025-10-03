import { useState, useEffect, useCallback } from 'react'
import { Star, ChevronDown, ChevronUp, UserCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Button } from './ui/button'

interface Review {
  id: string
  rating: number
  comment: string | null
  created_at: string | null
  reviewer: {
    id: string
    name: string
    avatar?: string | null
  }
}

interface ReviewListProps {
  sellerId: string
  limit?: number
  showLoadMore?: boolean
  className?: string
}

function ReviewList({
  sellerId,
  limit = 5,
  showLoadMore = true,
  className = ''
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set())

  // Define fetchReviews with useCallback to avoid recreation on each render
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('seller_reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          reviewer_id
        `)
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1)
        
      if (error) throw error
      
      // Fetch reviewer profiles separately
      const reviewerIds = data.map(review => review.reviewer_id)
      
      // Skip profile fetch if no reviews
      if (reviewerIds.length === 0) {
        setReviews([])
        setHasMore(false)
        setLoading(false)
        return
      }
      
      const { data: reviewers, error: reviewersError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, avatar_url')
        .in('id', reviewerIds)
        
      if (reviewersError) throw reviewersError

      // Create a map of reviewer profiles by ID for easy lookup
      type ReviewerProfile = {
        id: string;
        first_name: string | null;
        last_name: string | null;
        email: string;
        avatar_url: string | null;
      }
      
      const reviewerMap: Record<string, ReviewerProfile> = {}
      reviewers.forEach(reviewer => {
        reviewerMap[reviewer.id] = reviewer as ReviewerProfile
      })
      
      // Transform data to match our Review interface
      const formattedReviews = data.map(review => {
        const reviewer = reviewerMap[review.reviewer_id] || {}
        return {
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          created_at: review.created_at,
          reviewer: {
            id: reviewer.id || review.reviewer_id,
            name: `${reviewer.first_name || ''} ${reviewer.last_name || ''}`.trim() || reviewer.email || 'Utilisateur',
            avatar: reviewer.avatar_url || undefined
          }
        }
      })

      // If we're on the first page, replace reviews
      // Otherwise append to existing reviews
      if (page === 0) {
        setReviews(formattedReviews)
      } else {
        setReviews(prev => [...prev, ...formattedReviews])
      }

      // Check if there are more reviews to load
      setHasMore(data.length === limit)
    } catch (err) {
      console.error('Error fetching reviews:', err)
      setError('Erreur lors du chargement des évaluations')
    } finally {
      setLoading(false)
    }
  }, [sellerId, page, limit])


  // Add useEffect to fetch reviews when dependencies change
  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])
  
  const loadMore = () => {
    setPage(prev => prev + 1)
  }

  const toggleExpandReview = (reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev)
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId)
      } else {
        newSet.add(reviewId)
      }
      return newSet
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading && page === 0) {
    return (
      <div className={`py-8 text-left ${className}`}>
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-20 bg-gray-200 rounded w-full mb-2"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`py-4 text-left text-red-500 ${className}`}>
        {error}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className={`py-8 text-left text-gray-500 ${className}`}>
        Aucune évaluation pour ce vendeur
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {reviews.map(review => {
        const isExpanded = expandedReviews.has(review.id)
        const hasLongComment = review.comment && review.comment.length > 200
        const displayComment = hasLongComment && !isExpanded
          ? `${review.comment?.substring(0, 200)}...`
          : review.comment

        return (
          <div key={review.id} className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4">
                {review.reviewer.avatar ? (
                  <img 
                    src={review.reviewer.avatar} 
                    alt={review.reviewer.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <UserCircle className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-left">{review.reviewer.name}</h4>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        {review.created_at ? formatDate(review.created_at) : 'Date inconnue'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {review.comment && (
                  <div className="mt-3">
                    <p className="text-gray-700 whitespace-pre-line text-left">
                      {displayComment}
                    </p>
                    
                    {hasLongComment && (
                      <button 
                        onClick={() => toggleExpandReview(review.id)}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Voir moins
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Voir plus
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
      
      {showLoadMore && hasMore && (
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loading}
            className="border-gray-300 text-gray-700"
          >
            {loading ? 'Chargement...' : 'Voir plus d\'évaluations'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default ReviewList
