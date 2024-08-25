import { Article, useAuthSWR } from "../api";

export const useArticles = () => {
  const { data, error } = useAuthSWR<Article[]>("/articles", {
    refreshInterval: 10000,
  });

  return {
    articles: data,
    isLoading: !error && !data,
    isError: error,
  };
};
