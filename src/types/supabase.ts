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
      categories: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          image: string | null
          name: string
          parent_id: string | null
          search_count: number | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          name: string
          parent_id?: string | null
          search_count?: number | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          name?: string
          parent_id?: string | null
          search_count?: number | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      checkout_sessions: {
        Row: {
          amount: number
          checkout_status: string
          client_reference: string | null
          currency: string
          error_url: string
          id: string
          listing_data: Json
          payment_status: string | null
          success_url: string
          transaction_id: string | null
          user_id: string
          wave_launch_url: string
          wave_session_id: string
          when_completed: string | null
          when_created: string | null
          when_expires: string
        }
        Insert: {
          amount: number
          checkout_status?: string
          client_reference?: string | null
          currency?: string
          error_url: string
          id?: string
          listing_data: Json
          payment_status?: string | null
          success_url: string
          transaction_id?: string | null
          user_id: string
          wave_launch_url: string
          wave_session_id: string
          when_completed?: string | null
          when_created?: string | null
          when_expires: string
        }
        Update: {
          amount?: number
          checkout_status?: string
          client_reference?: string | null
          currency?: string
          error_url?: string
          id?: string
          listing_data?: Json
          payment_status?: string | null
          success_url?: string
          transaction_id?: string | null
          user_id?: string
          wave_launch_url?: string
          wave_session_id?: string
          when_completed?: string | null
          when_created?: string | null
          when_expires?: string
        }
        Relationships: []
      }
      listings: {
        Row: {
          category_id: string | null
          condition: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          featured: boolean | null
          id: string
          images: string[] | null
          location: string
          phone: string | null
          price: number
          status: string | null
          subcategory_id: string | null
          title: string
          updated_at: string | null
          user_id: string
          views: number | null
        }
        Insert: {
          category_id?: string | null
          condition?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          location: string
          phone?: string | null
          price: number
          status?: string | null
          subcategory_id?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          views?: number | null
        }
        Update: {
          category_id?: string | null
          condition?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          location?: string
          phone?: string | null
          price?: number
          status?: string | null
          subcategory_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          allow_reviews: boolean | null
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          first_name: string | null
          id: string
          is_profile_public: boolean | null
          is_verified: boolean | null
          last_name: string | null
          location: string | null
          phone: string | null
          profile_completion_percentage: number | null
          review_count: number | null
          seller_rating: number | null
          show_email: boolean | null
          show_phone: boolean | null
          social_links: Json | null
          updated_at: string | null
          verification_badges: string[] | null
          website: string | null
        }
        Insert: {
          allow_reviews?: boolean | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          first_name?: string | null
          id: string
          is_profile_public?: boolean | null
          is_verified?: boolean | null
          last_name?: string | null
          location?: string | null
          phone?: string | null
          profile_completion_percentage?: number | null
          review_count?: number | null
          seller_rating?: number | null
          show_email?: boolean | null
          show_phone?: boolean | null
          social_links?: Json | null
          updated_at?: string | null
          verification_badges?: string[] | null
          website?: string | null
        }
        Update: {
          allow_reviews?: boolean | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_profile_public?: boolean | null
          is_verified?: boolean | null
          last_name?: string | null
          location?: string | null
          phone?: string | null
          profile_completion_percentage?: number | null
          review_count?: number | null
          seller_rating?: number | null
          show_email?: boolean | null
          show_phone?: boolean | null
          social_links?: Json | null
          updated_at?: string | null
          verification_badges?: string[] | null
          website?: string | null
        }
        Relationships: []
      }
      search_queries: {
        Row: {
          created_at: string | null
          id: string
          query: string
          results_count: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          query: string
          results_count?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          query?: string
          results_count?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_queries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          reviewer_id: string
          seller_id: string
          updated_at: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          reviewer_id: string
          seller_id: string
          updated_at?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          reviewer_id?: string
          seller_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seller_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seller_reviews_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string | null
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
