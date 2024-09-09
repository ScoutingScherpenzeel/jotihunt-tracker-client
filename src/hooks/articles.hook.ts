import { Article } from '@/types/Article';
import { useAuthSWR } from '../lib/swr';

export const useArticles = () => {
  const { data, error } = useAuthSWR<Article[]>('/articles', {
    refreshInterval: 10000,
  });

  return {
    articles: data,
    isLoading: !error && !data,
    isError: error,
  };
};
