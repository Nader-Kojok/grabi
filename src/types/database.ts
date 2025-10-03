export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          location: string | null
          date_of_birth: string | null
          website: string | null
          social_links: Json | null
          is_verified: boolean | null
          verification_badges: string[] | null
          profile_completion_percentage: number | null
          seller_rating: number | null
          review_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          location?: string | null
          date_of_birth?: string | null
          website?: string | null
          social_links?: Json | null
          is_verified?: boolean | null
          verification_badges?: string[] | null
          profile_completion_percentage?: number | null
          seller_rating?: number | null
          review_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          location?: string | null
          date_of_birth?: string | null
          website?: string | null
          social_links?: Json | null
          is_verified?: boolean | null
          verification_badges?: string[] | null
          profile_completion_percentage?: number | null
          seller_rating?: number | null
          review_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string | null
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          color?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      listings: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          currency: string
          location: string
          images: string[] | null
          category_id: string
          user_id: string
          status: 'active' | 'sold' | 'inactive'
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          currency?: string
          location: string
          images?: string[] | null
          category_id: string
          user_id: string
          status?: 'active' | 'sold' | 'inactive'
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          currency?: string
          location?: string
          images?: string[] | null
          category_id?: string
          user_id?: string
          status?: 'active' | 'sold' | 'inactive'
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      search_queries: {
        Row: {
          id: string
          query: string
          count: number
          last_searched: string
          created_at: string
        }
        Insert: {
          id?: string
          query: string
          count?: number
          last_searched?: string
          created_at?: string
        }
        Update: {
          id?: string
          query?: string
          count?: number
          last_searched?: string
          created_at?: string
        }
        Relationships: []
      }
      seller_reviews: {
        Row: {
          id: string
          reviewer_id: string
          seller_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reviewer_id: string
          seller_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reviewer_id?: string
          seller_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seller_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seller_reviews_seller_id_fkey"
            columns: ["seller_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_favorites: {
        Row: {
          user_id: string
          listing_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          listing_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          listing_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_listing_id_fkey"
            columns: ["listing_id"]
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}