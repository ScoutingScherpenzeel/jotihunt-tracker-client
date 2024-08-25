import useSWR from "swr";
import { fetcher, Team, useAuthSWR } from "../api";

export const useTeams = () => {
  const { data, error } = useAuthSWR<Team[]>("/teams");

  return {
    teams: data,
    isLoading: !error && !data,
    isError: error,
  };
};
