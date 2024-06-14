import useSWR from "swr";
import { fetcher, Team } from "../api";

export const useTeams = () => {
    const { data, error } = useSWR<Team[]>("/teams", fetcher);

    return {
        teams: data,
        isLoading: !error && !data,
        isError: error,
    };
};