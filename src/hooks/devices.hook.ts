import useSWR from "swr";
import { Device, fetcher } from "../api";

export const useDevices = () => {
  const { data, error } = useSWR<Device[]>("/tracker/positions", fetcher);

  return {
    devices: data,
    isLoading: !error && !data,
    isError: error,
  };
};
