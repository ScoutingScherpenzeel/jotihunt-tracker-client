import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CounterHuntState {
  direction: number;
  visible: boolean;
  setDirection: (direction: number) => void;
  setVisible: (visible: boolean) => void;
}

const useCounterHuntStore = create<CounterHuntState>()(
  persist(
    (set) => ({
      direction: 0,
      visible: false,
      setDirection: (direction: number) => {
        set({ direction });
      },
      setVisible: (visible: boolean) => {
        set({ visible });
      },
    }),
    {
      name: "counter-hunt-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCounterHuntStore;
