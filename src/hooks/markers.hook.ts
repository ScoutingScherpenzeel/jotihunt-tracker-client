import useSWR from "swr";
import { fetcher, Marker, post } from "../api";

export const useMarkers = () => {
  const { data, error, mutate } = useSWR<Marker[]>("/markers", fetcher, {
    refreshInterval: 5000,
  });

  async function createMarker(marker: Marker): Promise<boolean> {
    const result = await post("/markers", marker);
    if (result._id) {
      mutate((data) => {
        if (data) {
          return [...data, result];
        }
        return [result];
      });
        return true;
    }
    return false;
  }

  return {
    markers: data,
    isLoading: !error && !data,
    isError: error,
    createMarker,
  };
};
