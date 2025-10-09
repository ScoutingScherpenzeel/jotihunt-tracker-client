import {Team} from '@/types/Team';
import {useAuthSWR} from '../lib/swr';
import {useFetcher} from './utils/api.hook';

export const useTeams = () => {
    const TEAMS_AREA_EDITING = import.meta.env.TEAMS_AREA_EDITING === 'true';
    const {data, error, mutate} = useAuthSWR<Team[]>('/teams', {
        refreshInterval: 1000,
    });
    const {fetch} = useFetcher();

    async function setTeamArea(id: string, area: string | undefined) {
        if (!TEAMS_AREA_EDITING) return false;
        const result = await fetch(`/teams/${id}/area`, 'PUT', {area});
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
