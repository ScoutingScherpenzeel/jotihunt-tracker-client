import { Team } from '@/types/Team';
import { useAuthSWR } from '../lib/swr';

export const useTeams = () => {
  const { data, error } = useAuthSWR<Team[]>('/teams');

  return {
    teams: data,
    isLoading: !error && !data,
    isError: error,
  };
};
