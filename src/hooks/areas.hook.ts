import useSWR from "swr";
import { fetcher, Area } from "../api";

export const useAreas = () => {
  const { data, error } = useSWR<Area[]>("/areas", fetcher, {
    refreshInterval: 1000,
  });

  return {
    areas: data,
    isLoading: !error && !data,
    isError: error,
  };
};
