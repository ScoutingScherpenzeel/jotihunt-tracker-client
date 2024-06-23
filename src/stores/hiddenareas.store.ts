import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface HiddenAreasState {
  hiddenAreas: string[];
  toggleHidden: (areaName: string) => void;
}

const useHiddenAreasStore = create<HiddenAreasState>()(
  persist(
    (set) => ({
      hiddenAreas: [],
      toggleHidden: (areaName: string) => {
        areaName = areaName.toLowerCase();
        set((state) => ({
          hiddenAreas: state.hiddenAreas.includes(areaName)
            ? state.hiddenAreas.filter((area) => area !== areaName)
            : [...state.hiddenAreas, areaName],
        }));
      },
    }),
    {
      name: "hidden-areas-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useHiddenAreasStore;
