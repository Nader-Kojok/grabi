-- Create seller_reviews table
CREATE TABLE IF NOT EXISTS seller_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Prevent duplicate reviews from the same user to the same seller
  CONSTRAINT unique_reviewer_seller UNIQUE(reviewer_id, seller_id),
  -- Prevent users from reviewing themselves
  CONSTRAINT no_self_reviews CHECK (reviewer_id != seller_id)
);

-- Create trigger for updated_at
CREATE TRIGGER update_seller_reviews_updated_at BEFORE UPDATE ON seller_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE seller_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for seller_reviews
-- Anyone can view reviews
CREATE POLICY "Reviews are viewable by everyone" ON seller_reviews
  FOR SELECT USING (true);

-- Only the reviewer can create their own review
CREATE POLICY "Users can insert their own reviews" ON seller_reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Only the reviewer can update their own review
CREATE POLICY "Users can update their own reviews" ON seller_reviews
  FOR UPDATE USING (auth.uid() = reviewer_id);

-- Only the reviewer can delete their own review
CREATE POLICY "Users can delete their own reviews" ON seller_reviews
  FOR DELETE USING (auth.uid() = reviewer_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_seller_reviews_seller_id ON seller_reviews(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_reviews_reviewer_id ON seller_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_seller_reviews_rating ON seller_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_seller_reviews_created_at ON seller_reviews(created_at DESC);

-- Add seller_rating field to profiles table to store the average rating
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS seller_rating NUMERIC(3,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Create function to update seller rating when reviews change
CREATE OR REPLACE FUNCTION update_seller_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating NUMERIC(3,2);
  review_count INTEGER;
BEGIN
  -- Calculate the new average rating for the seller
  SELECT AVG(rating)::NUMERIC(3,2), COUNT(*)
  INTO avg_rating, review_count
  FROM seller_reviews
  WHERE seller_id = COALESCE(NEW.seller_id, OLD.seller_id);
  
  -- Update the seller's profile with the new average rating
  UPDATE profiles
  SET seller_rating = avg_rating,
      review_count = review_count
  WHERE id = COALESCE(NEW.seller_id, OLD.seller_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to update seller rating on review changes
CREATE TRIGGER update_rating_on_review_insert
  AFTER INSERT ON seller_reviews
  FOR EACH ROW EXECUTE FUNCTION update_seller_rating();

CREATE TRIGGER update_rating_on_review_update
  AFTER UPDATE ON seller_reviews
  FOR EACH ROW EXECUTE FUNCTION update_seller_rating();

CREATE TRIGGER update_rating_on_review_delete
  AFTER DELETE ON seller_reviews
  FOR EACH ROW EXECUTE FUNCTION update_seller_rating();
