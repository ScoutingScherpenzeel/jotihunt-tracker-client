import { create } from "zustand";

type Coords = { x: string; y: string } | null;

type HintFormBridge = {
    coords: Coords;
    setCoords: (x: string, y: string) => void;
    clear: () => void;
};

export const useHintFormBridge = create<HintFormBridge>((set) => ({
    coords: null,
    setCoords: (x, y) => set({ coords: { x, y } }),
    clear: () => set({ coords: null }),
}));