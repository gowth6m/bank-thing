import type { UserDto } from 'src/services/types';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { CONFIG } from 'src/config';

// ----------------------------------------------------

export interface AuthState {
  token: {
    access: string | null;
    refresh: string | null;
  };
  user: UserDto | null;
  isLoading: boolean;

  setToken: (access: string | null, refresh: string | null) => void;
  setUser: (user: UserDto | null) => void;
  setIsLoading: (isLoading: boolean) => void;

  resetAuth: () => void;
}

// ----------------------------------------------------

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _) => ({
      token: {
        access: null,
        refresh: null,
      },
      user: null,
      isLoading: false,

      setToken: (access: string | null, refresh: string | null) => {
        set({ token: { access, refresh } });
      },
      setUser: (user: any | null) => {
        set({ user });
      },
      setIsLoading: (isLoading: boolean) => {
        set({ isLoading });
      },
      resetAuth: () => {
        set({ token: { access: null, refresh: null }, user: null });
      },
    }),
    {
      name: CONFIG.LOCAL_STORAGE_KEYS.AUTH,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
