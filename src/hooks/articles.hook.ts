import useSWR from "swr";
import { fetcher, Article } from "../api";

export const useArticles = () => {
  const { data, error } = useSWR<Article[]>("/articles", fetcher, {
    refreshInterval: 10000,
  });

  return {
    articles: data,
    isLoading: !error && !data,
    isError: error,
  };
};
