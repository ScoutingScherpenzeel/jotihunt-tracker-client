import useSWR from "swr";
import { fetcher, Hunt } from "../api";

export const useHunts = () => {
  const { data, error } = useSWR<Hunt[]>("/hunts", fetcher, {
    refreshInterval: 5000,
  });

  return {
    hunts: data,
    isLoading: !error && !data,
    isError: error,
  };
};
