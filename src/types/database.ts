export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          is_profile_public: boolean | null
          show_email: boolean | null
          show_phone: boolean | null
          allow_reviews: boolean | null
          created_at: string | null
          updated_at: string | null
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
          is_profile_public?: boolean | null
          show_email?: boolean | null
          show_phone?: boolean | null
          allow_reviews?: boolean | null
          created_at?: string | null
          updated_at?: string | null
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
          is_profile_public?: boolean | null
          show_email?: boolean | null
          show_phone?: boolean | null
          allow_reviews?: boolean | null
          created_at?: string | null
          updated_at?: string | null
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
          currency: string | null
          location: string
          images: string[] | null
          category_id: string | null
          user_id: string
          status: string | null
          featured: boolean | null
          views: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          currency?: string | null
          location: string
          images?: string[] | null
          category_id?: string | null
          user_id: string
          status?: string | null
          featured?: boolean | null
          views?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          currency?: string | null
          location?: string
          images?: string[] | null
          category_id?: string | null
          user_id?: string
          status?: string | null
          featured?: boolean | null
          views?: number | null
          created_at?: string | null
          updated_at?: string | null
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
          user_id: string | null
          results_count: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          query: string
          user_id?: string | null
          results_count?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          query?: string
          user_id?: string | null
          results_count?: number | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_queries_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      seller_reviews: {
        Row: {
          id: string
          reviewer_id: string
          seller_id: string
          rating: number
          comment: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          reviewer_id: string
          seller_id: string
          rating: number
          comment?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          reviewer_id?: string
          seller_id?: string
          rating?: number
          comment?: string | null
          created_at?: string | null
          updated_at?: string | null
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
          id: string
          user_id: string
          listing_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          listing_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          listing_id?: string
          created_at?: string | null
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