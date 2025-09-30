import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SearchQuery, SearchState } from '../types';

interface SearchStore extends SearchState {
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (id: string) => void;
  clearRecentSearches: () => void;
  setQuery: (query: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  setSuggestions: (suggestions: string[]) => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      query: '',
      isSearching: false,
      suggestions: [],
      recentSearches: [],

      addRecentSearch: (query: string) => {
        const { recentSearches } = get();
        const trimmedQuery = query.trim();
        
        if (!trimmedQuery) return;
        
        // Remove existing search if it exists
        const filteredSearches = recentSearches.filter(
          search => search.query.toLowerCase() !== trimmedQuery.toLowerCase()
        );
        
        // Add new search at the beginning
        const newSearch: SearchQuery = {
          id: Date.now().toString(),
          query: trimmedQuery,
          timestamp: new Date(),
        };
        
        // Keep only the last 10 searches
        const updatedSearches = [newSearch, ...filteredSearches].slice(0, 10);
        
        set({ recentSearches: updatedSearches });
      },

      removeRecentSearch: (id: string) => {
        const { recentSearches } = get();
        set({
          recentSearches: recentSearches.filter(search => search.id !== id)
        });
      },

      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },

      setQuery: (query: string) => {
        set({ query });
      },

      setIsSearching: (isSearching: boolean) => {
        set({ isSearching });
      },

      setSuggestions: (suggestions: string[]) => {
        set({ suggestions });
      },
    }),
    {
      name: 'search-storage',
      partialize: (state) => ({ 
        recentSearches: state.recentSearches 
      }),
    }
  )
);