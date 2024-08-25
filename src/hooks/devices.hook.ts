import { Device, useAuthSWR } from "../api";

export const useDevices = () => {
  const { data, error } = useAuthSWR<Device[]>("/tracker/positions", {
    refreshInterval: 100,
    refreshWhenOffline: true,
    refreshWhenHidden: true,
  });

  return {
    devices: data,
    isLoading: !error && !data,
    isError: error,
  };
};
