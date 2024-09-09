import axios from 'axios';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

export const useFetcher = () => {
  const baseUrl = import.meta.env.API_BASE_URL;
  const authHeader = useAuthHeader();

  async function fetch<T>(url: string, method: 'GET' | 'POST' | 'DELETE' | 'PUT' = 'GET', body?: any) {
    return axios.request<T>({
      url: `${baseUrl}${url}`,
      method,
      headers: {
        Authorization: authHeader,
      },
      data: body, // Used for POST, PUT, DELETE, etc.
    });
  }

  return {
    fetch,
  };
};
