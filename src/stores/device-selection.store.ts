import { create } from 'zustand';

interface DeviceSelectionState {
  selectedDeviceId?: number;
  setSelectedDeviceId: (selectedDeviceId: number) => void;
  clearSelectedDeviceId: () => void;
}

const useDeviceSelectionStore = create<DeviceSelectionState>((set) => ({
  selectedDeviceId: undefined,
  setSelectedDeviceId: (selectedDeviceId: number) => {
    set({ selectedDeviceId });
  },
  clearSelectedDeviceId: () => {
    set({ selectedDeviceId: undefined });
  },
}));

export default useDeviceSelectionStore;

