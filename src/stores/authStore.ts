import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { User } from '../types';
import type { AuthError } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      initialize: async () => {
        set({ isLoading: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            console.log('Fetching profile for user:', session.user.id);
            
            // Fetch user profile from profiles table
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            console.log('Profile fetch result:', { profile, error });

            if (profile) {
               const user: User = {
                 id: profile.id,
                 name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email,
                 email: profile.email,
                 avatar: profile.avatar_url || undefined,
                 bannerUrl: profile.banner_url || undefined,
                 phone: profile.phone || undefined,
                 bio: profile.bio || undefined,
                 location: profile.location || undefined,
                 dateOfBirth: profile.date_of_birth || undefined,
                 website: profile.website || undefined,
                 socialLinks: (profile.social_links as Record<string, string>) || undefined,
                 isVerified: profile.is_verified || false,
                 verificationBadges: profile.verification_badges || [],
                 profileCompletionPercentage: profile.profile_completion_percentage || 0,
               };
               console.log('Setting user state:', user);
               set({ user, isLoading: false });
             }
          } else {
            console.log('No session found');
            set({ user: null, isLoading: false });
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({ user: null, isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        console.log('Login attempt started:', { email });
        set({ isLoading: true });
        try {
          console.log('Calling supabase.auth.signInWithPassword...');
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          console.log('Supabase auth response:', { data, error });

          if (error) {
            console.error('Supabase auth error:', error);
            throw error;
          }

          if (data.user) {
            console.log('User authenticated, fetching profile...');
            // Fetch user profile from profiles table
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            console.log('Profile fetch result:', profile);

            if (profile) {
              const user: User = {
                id: profile.id,
                name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email,
                email: profile.email,
                avatar: profile.avatar_url || undefined,
                bannerUrl: profile.banner_url || undefined,
                phone: profile.phone || undefined,
                bio: profile.bio || undefined,
                location: profile.location || undefined,
                dateOfBirth: profile.date_of_birth || undefined,
                website: profile.website || undefined,
                socialLinks: (profile.social_links as Record<string, string>) || undefined,
                isVerified: profile.is_verified || false,
                verificationBadges: profile.verification_badges || [],
                profileCompletionPercentage: profile.profile_completion_percentage || 0,
              };
              console.log('Setting user in store:', user);
              set({ user, isLoading: false });
            }
          }
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          throw error as AuthError;
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({ user: null });
        } catch (error) {
          console.error('Error logging out:', error);
          // Still clear local state even if logout fails
          set({ user: null });
        }
      },

      register: async (userData) => {
        console.log('Register attempt started:', userData);
        set({ isLoading: true });
        try {
          console.log('Calling supabase.auth.signUp...');
          const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
              data: {
                first_name: userData.firstName,
                last_name: userData.lastName,
                phone: userData.phone,
              }
            }
          });

          console.log('Supabase register response:', { data, error });

          if (error) {
            console.error('Supabase register error:', error);
            throw error;
          }

          if (data.user) {
            console.log('User registered successfully:', data.user);
            // User will be automatically logged in if email confirmation is disabled
            // or after email confirmation if enabled
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Register error:', error);
          set({ isLoading: false });
          throw error as AuthError;
        }
      },

      updateUser: async (userData: Partial<User>) => {
        const { user } = get();
        if (!user) throw new Error('No user logged in');

        try {
          console.log('Updating user profile with data:', userData);
          console.log('User ID:', user.id);
          
          const updateData = {
            first_name: userData.name?.split(' ')[0],
            last_name: userData.name?.split(' ').slice(1).join(' '),
            phone: userData.phone,
            bio: userData.bio,
            location: userData.location,
            date_of_birth: userData.dateOfBirth && userData.dateOfBirth.trim() !== '' ? userData.dateOfBirth : null,
            website: userData.website,
            social_links: userData.socialLinks,
            avatar_url: userData.avatar,
            banner_url: userData.bannerUrl,
            updated_at: new Date().toISOString(),
          };
          
          console.log('Database update payload:', updateData);
          
          const { data, error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', user.id)
            .select();

          console.log('Database update result:', { data, error });

          if (error) throw error;

          // Update local state
          set({ user: { ...user, ...userData } });
          console.log('Local state updated successfully');
        } catch (error) {
          console.error('Error updating user:', error);
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// Listen to auth changes
supabase.auth.onAuthStateChange((event) => {
  const { initialize } = useAuthStore.getState();
  
  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    initialize();
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null });
  }
});