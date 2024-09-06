// store settings, such as map style
// map style is defined by an enum
// eventually represented as a url

import { MapStyle } from '@/types/MapStyle';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingsState {
  mapStyle: MapStyle;
  setMapStyle: (mapStyle: MapStyle) => void;
}

const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      mapStyle: MapStyle.Streets,
      setMapStyle: (mapStyle: MapStyle) => {
        set({ mapStyle });
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSettingsStore;
