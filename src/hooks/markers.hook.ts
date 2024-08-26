import { fetcherWithMethod, Marker, useAuthSWR } from '../api';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

export const useMarkers = () => {
  const authHeader = useAuthHeader() || '';

  const { data, error, mutate } = useAuthSWR<Marker[]>('/markers', {
    refreshInterval: 5000,
  });

  /**
   * Create a new marker via the API.
   * Updates the local state with the new marker.
   * @param marker The marker to create
   * @returns True if the marker was created successfully, false otherwise
   */
  async function createMarker(marker: Marker): Promise<boolean> {
    const result = await fetcherWithMethod('/markers', authHeader, 'POST', marker);
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

  /**
   * Delete a marker via the API.
   * @param markerId The ID of the marker to delete
   * @returns True if the marker was deleted successfully, false otherwise
   */
  async function deleteMarker(markerId: string): Promise<boolean> {
    const result = await fetcherWithMethod(`/markers/${markerId}`, authHeader, 'DELETE');
    if (result) {
      mutate((data) => {
        if (data) {
          return data.filter((marker) => marker._id !== markerId);
        }
        return [];
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
    deleteMarker,
  };
};
