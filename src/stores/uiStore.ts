import { create } from 'zustand';
import type { UIState } from '../types';

interface UIStore extends UIState {
  setMobileMenuOpen: (isOpen: boolean) => void;
  toggleMobileMenu: () => void;
  setSearchFocused: (isFocused: boolean) => void;
  setCurrentSection: (section: string) => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  isMobileMenuOpen: false,
  isSearchFocused: false,
  currentSection: 'home',

  setMobileMenuOpen: (isOpen: boolean) => {
    set({ isMobileMenuOpen: isOpen });
  },

  toggleMobileMenu: () => {
    const { isMobileMenuOpen } = get();
    set({ isMobileMenuOpen: !isMobileMenuOpen });
  },

  setSearchFocused: (isFocused: boolean) => {
    set({ isSearchFocused: isFocused });
  },

  setCurrentSection: (section: string) => {
    set({ currentSection: section });
  },
}));