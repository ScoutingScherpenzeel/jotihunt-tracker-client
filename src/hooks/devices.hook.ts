import { Position } from '@/types/Position';
import { useAuthSWR } from '../lib/swr';
import { Device } from '@/types/Device';

export const useDevices = () => {
  const { data: positions, error: positionsError } = useAuthSWR<Position[]>('/tracker/positions', {
    refreshInterval: 100,
  });
  const { data: devices, error: devicesError } = useAuthSWR<Device[]>('/tracker/devices', {
    refreshInterval: 100,
  });

  return {
    positions: positions,
    devices: devices,
    isLoading: !(positionsError || devicesError) && !(positions && devices),
    isError: positionsError || devicesError,
  };
};
