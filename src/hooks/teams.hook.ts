import { Team } from '@/types/Team';
import { useAuthSWR } from '../lib/swr';
import { useFetcher } from './utils/api.hook';

export const useTeams = () => {
  const { data, error, mutate } = useAuthSWR<Team[]>('/teams');
  const { fetch } = useFetcher();

  async function setTeamArea(id: string, area: string) {
    const result = await fetch(`/teams/${id}/area`, 'PUT', { area });
    mutate();
    return result.status === 200;
  }

  return {
    teams: data,
    isLoading: !error && !data,
    isError: error,
    setTeamArea,
  };
};
