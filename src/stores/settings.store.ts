// store settings, such as map style
// map style is defined by an enum
// eventually represented as a url

import { MapStyle } from '@/types/MapStyle';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingsState {
  mapStyle: MapStyle;
  darkMode?: Boolean;
  setMapStyle: (mapStyle: MapStyle) => void;
  setDarkMode: (darkMode?: Boolean) => void;
}

const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      mapStyle: MapStyle.Streets,
      darkMode: undefined,
      setMapStyle: (mapStyle: MapStyle) => {
        set({ mapStyle });
      },
      setDarkMode: (darkMode?: Boolean) => {
        set({ darkMode });
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSettingsStore;
