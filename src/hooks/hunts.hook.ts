import { Hunt, useAuthSWR } from '../api';

export const useHunts = () => {
  const { data, error } = useAuthSWR<Hunt[]>('/hunts', {
    refreshInterval: 5000,
  });

  return {
    hunts: data,
    isLoading: !error && !data,
    isError: error,
  };
};
