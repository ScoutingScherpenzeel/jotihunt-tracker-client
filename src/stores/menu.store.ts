// store for the menu

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface MenuState {
  menuOpen: boolean;
  toggleMenu: () => void;
  setMenuOpen: (menuOpen: boolean) => void;
}

const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      menuOpen: false,
      toggleMenu: () => {
        set((state) => ({ menuOpen: !state.menuOpen }));
      },
      setMenuOpen: (menuOpen: boolean) => {
        set({ menuOpen });
      },
    }),
    {
      name: 'menu-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useMenuStore;
