import axios from 'axios';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import useSWR, { SWRConfiguration } from 'swr';

const baseUrl = import.meta.env.API_BASE_URL;

/**
 * Axios fetcher with method and body handling (+ auth headers)
 * @param url The URL to fetch from / to
 * @param authHeader The authorization header to use
 * @param method The HTTP method to use
 * @param body The body to send with the request
 * @returns The data returned by the API
 */
export const fetcherWithMethod = async (url: string, authHeader: string, method: 'GET' | 'POST' | 'DELETE' | 'PUT' = 'GET', body?: any) => {
  const response = await axios({
    url: `${baseUrl}${url}`,
    method,
    headers: {
      Authorization: authHeader,
    },
    data: body, // Used for POST, PUT, DELETE, etc.
  });

  if (response.data.error) throw new Error(response.data.error);
  return response.data;
};

/**
 * Fetch data from the API with authentication.
 * @param url The URL to fetch from / to
 * @param options SWR specific options
 * @param method The HTTP method to use
 * @param body The body to send with the request
 * @returns The data returned by the API
 */
export const useAuthSWR = <T>(url: string, options?: SWRConfiguration, method: 'GET' | 'POST' | 'DELETE' | 'PUT' = 'GET', body?: any) => {
  const authHeader = useAuthHeader();

  // SWR fetcher with method and body handling
  const swrFetcher = ([url, authHeader]: [string, string]) => fetcherWithMethod(url, authHeader, method, body);

  return useSWR<T>([url, authHeader], swrFetcher, options);
};
