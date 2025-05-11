import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { CONFIG } from 'src/config';

// ----------------------------------------------------

export interface SettingsState {
  themeMode: 'light' | 'dark';
  navDrawerMode: 'expanded' | 'collapsed';

  toggleThemeMode: () => void;
  toggleNavDrawerMode: () => void;
}

// ----------------------------------------------------

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      themeMode: 'light',
      navDrawerMode: 'expanded',

      toggleThemeMode: () => {
        const currentThemeMode = get().themeMode;
        set({ themeMode: currentThemeMode === 'light' ? 'dark' : 'light' });
      },
      toggleNavDrawerMode: () => {
        const currentNavDrawerMode = get().navDrawerMode;
        set({ navDrawerMode: currentNavDrawerMode === 'expanded' ? 'collapsed' : 'expanded' });
      },
    }),
    {
      name: CONFIG.LOCAL_STORAGE_KEYS.SETTINGS,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
