export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  location?: string;
  dateOfBirth?: string;
  website?: string;
  socialLinks?: Record<string, string>;
  bannerUrl?: string;
  isVerified?: boolean;
  verificationBadges?: string[];
  profileCompletionPercentage?: number;
}

export interface SearchQuery {
  id: string;
  query: string;
  timestamp: Date;
  resultsCount?: number;
}

export interface TrendingSearch {
  id: string;
  query: string;
  rank: number;
  searchCount: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  searchCount?: number;
  trend?: 'up' | 'down' | 'stable';
  trendPercentage?: number;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  image: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  createdAt: Date;
  featured?: boolean;
}

export interface TrendingCategory extends Category {
  rank: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

// UI State types
export interface SearchState {
  query: string;
  isSearching: boolean;
  suggestions: string[];
  recentSearches: SearchQuery[];
}

export interface UIState {
  isMobileMenuOpen: boolean;
  isSearchFocused: boolean;
  currentSection: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}