import { Hunt } from '@/types/Hunt';
import { useAuthSWR } from '../lib/swr';

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
