import { Team } from '@/types/Team';
import { useAuthSWR } from '../lib/swr';
import { useFetcher } from './utils/api.hook';

export const useTeams = () => {
  const { data, error, mutate } = useAuthSWR<Team[]>('/teams', {
    refreshInterval: 1000,
  });
  const { fetch } = useFetcher();

  async function setTeamArea(id: string, area: string | undefined) {
    const result = await fetch(`/teams/${id}/area`, 'PUT', { area });
    mutate();
    return result.status === 200;
  }

  async function reloadTeams() {
    try {
      const result = await fetch('/teams/reload', 'POST');
      mutate();
      return result.status === 200;
    } catch (e) {
      return false;
    }
  }

  return {
    teams: data,
    isLoading: !error && !data,
    isError: error,
    setTeamArea,
    reloadTeams,
  };
};
