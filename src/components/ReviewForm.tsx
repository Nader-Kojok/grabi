import React, { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

interface ReviewFormProps {
  readonly sellerId: string
  readonly onReviewSubmitted?: () => void
  readonly className?: string
}

function ReviewForm({
  sellerId,
  onReviewSubmitted,
  className = ''
}: Readonly<ReviewFormProps>) {
  const { user } = useAuthStore()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [existingReview, setExistingReview] = useState<{ id: string, rating: number, comment: string | null } | null>(null)

  // Check if user has already reviewed this seller
  React.useEffect(() => {
    if (user && sellerId) {
      checkExistingReview()
    }
  }, [user, sellerId])

  const checkExistingReview = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('seller_reviews')
        .select('id, rating, comment')
        .eq('reviewer_id', user.id)
        .eq('seller_id', sellerId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking existing review:', error)
        return
      }

      if (data) {
        setExistingReview(data)
        setRating(data.rating)
        setComment(data.comment || '')
      }
    } catch (err) {
      console.error('Error checking existing review:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('Vous devez être connecté pour laisser une évaluation')
      return
    }
    
    if (rating === 0) {
      setError('Veuillez sélectionner une note')
      return
    }
    
    if (user.id === sellerId) {
      setError('Vous ne pouvez pas évaluer votre propre profil')
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)
    
    try {
      let result
      
      if (existingReview) {
        // Update existing review
        result = await supabase
          .from('seller_reviews')
          .update({
            rating,
            comment: comment.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingReview.id)
      } else {
        // Create new review
        result = await supabase
          .from('seller_reviews')
          .insert({
            reviewer_id: user.id,
            seller_id: sellerId,
            rating,
            comment: comment.trim() || null
          })
      }
      
      if (result.error) throw result.error
      
      setSuccess(true)
      if (onReviewSubmitted) onReviewSubmitted()
      
      // If it was a new review, update the state to reflect it's now an existing review
      if (!existingReview) {
        checkExistingReview()
      }
    } catch (err: any) {
      console.error('Error submitting review:', err)
      
      if (err.code === '23514' && err.message.includes('no_self_reviews')) {
        setError('Vous ne pouvez pas évaluer votre propre profil')
      } else if (err.code === '23505' && err.message.includes('unique_reviewer_seller')) {
        setError('Vous avez déjà évalué ce vendeur')
      } else {
        setError('Une erreur est survenue lors de l\'envoi de votre évaluation')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className={`p-4 bg-gray-50 rounded-lg border border-gray-200 text-left ${className}`}>
        <p className="text-gray-600 mb-2">Connectez-vous pour laisser une évaluation</p>
        <Button 
          onClick={() => window.location.href = '/login'}
          className="bg-red-600 hover:bg-red-700"
        >
          Se connecter
        </Button>
      </div>
    )
  }
  
  if (user.id === sellerId) {
    return null // Don't show the form if the user is viewing their own profile
  }

  return (
    <div className={`p-6 bg-white rounded-lg border border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left">
        {existingReview ? 'Modifier votre évaluation' : 'Évaluer ce vendeur'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="rating" className="block text-sm font-semibold text-gray-900 mb-2 text-left">
            Note
          </label>
          <div id="rating" className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${
                    (hoverRating || rating) >= star
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-semibold text-gray-900 mb-2 text-left">
            Commentaire (optionnel)
          </label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
            placeholder="Partagez votre expérience avec ce vendeur..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
          />
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
            Votre évaluation a été {existingReview ? 'mise à jour' : 'envoyée'} avec succès !
          </div>
        )}
        
        <Button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="bg-red-600 hover:bg-red-700 w-full"
        >
          {(() => {
            if (isSubmitting) return 'Envoi en cours...'
            if (existingReview) return 'Mettre à jour l\'évaluation'
            return 'Envoyer l\'évaluation'
          })()}
        </Button>
      </form>
    </div>
  )
}

export default ReviewForm
