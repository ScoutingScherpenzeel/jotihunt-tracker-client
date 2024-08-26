import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface LayersState {
  showTeams: boolean;
  showDevices: boolean;
  showHintsPart1: boolean;
  showHintsPart2: boolean;
  showHomeCircle: boolean;
  toggleTeams: () => void;
  toggleDevices: () => void;
  toggleHintsPart1: () => void;
  toggleHintsPart2: () => void;
  toggleHomeCircle: () => void;
}

const useLayersStore = create<LayersState>()(
  persist(
    (set) => ({
      showTeams: true,
      showDevices: true,
      showHintsPart1: true,
      showHintsPart2: true,
      showHomeCircle: true,
      toggleTeams: () => {
        set((state) => ({ showTeams: !state.showTeams }));
      },
      toggleDevices: () => {
        set((state) => ({ showDevices: !state.showDevices }));
      },
      toggleHintsPart1: () => {
        set((state) => ({ showHintsPart1: !state.showHintsPart1 }));
      },
      toggleHintsPart2: () => {
        set((state) => ({ showHintsPart2: !state.showHintsPart2 }));
      },
      toggleHomeCircle: () => {
        set((state) => ({ showHomeCircle: !state.showHomeCircle }));
      },
    }),
    {
      name: 'layers-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useLayersStore;
