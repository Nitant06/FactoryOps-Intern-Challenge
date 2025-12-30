import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState{
    userEmail:string | null,
    userRole: 'operator' | 'supervisor' | null,
    token: string | null,
    login: (email: string, role: 'operator' | 'supervisor') => void,
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set)=>({
             userEmail: null,
             userRole: null,
             token: null,

      // Login
      login: (email, role) => {
        const mockJwt = `mock-jwt-${Date.now()}-${Math.random()}`;
        set({ 
          userEmail: email, 
          userRole: role, 
          token: mockJwt 
        });
      },

      // Logout
      logout: () => set({ userEmail: null, userRole: null, token: null }),
        }),
        {
      name: 'auth-storage', 
      storage: createJSONStorage(() => AsyncStorage),
    }
    )

)

