import useSWR from "swr";
import { Device, fetcher } from "../api";

export const useDevices = () => {
  const { data, error } = useSWR<Device[]>("/tracker/positions", fetcher, {
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
