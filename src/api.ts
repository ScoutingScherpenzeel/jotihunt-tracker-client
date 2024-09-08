import axios from 'axios';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import useSWR, { SWRConfiguration } from 'swr';

const baseUrl = import.meta.env.API_BASE_URL;

/**
 * Simple GET request without auth headers
 * @param url The URL to fetch from / to
 * @returns The data returned by the API
 */
export const fetcher = async (url: string) => {
  const { data } = await axios.get(`${baseUrl}${url}`);
  if (data.error) throw new Error(data.error);
  return data;
};

/**
 * Simple POST request without auth headers
 * @param url The URL to fetch from / to
 * @param body The body to send with the request
 * @returns The data returned by the API
 */
export const post = async (url: string, body: any) => {
  const { data } = await axios.post(`${baseUrl}${url}`, body);
  if (data.error) throw new Error(data.error);
  return data;
};

/**
 * Simple DELETE request without auth headers
 * @param url The URL to fetch from / to
 * @returns The data returned by the API
 */
export const del = async (url: string) => {
  const { data } = await axios.delete(`${baseUrl}${url}`);
  if (data.error) throw new Error(data.error);
  return data;
};

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

export interface Team {
  _id: string;
  name: string;
  accomodation: string;
  street: string;
  houseNumber: string;
  houseNumberAddition: string;
  postCode: string;
  city: string;
  area?: string;
  location: {
    type: string;
    coordinates: number[];
  };
}

export interface Device {
  id: string;
  attributes: {
    batteryLevel: number;
    distance: number;
    totalDistance: number;
    motion: boolean;
  };
  deviceId: number;
  latitude: number;
  longitude: number;
  speed: number;
  course: number;
  accuracy: number;
  deviceName: string;
  fixTime: string;
}

export interface Area {
  _id: string;
  name: string;
  status: string;
  updatedAt: string;
}

export interface Hunt {
  _id: string;
  area: string;
  huntCode: string;
  status: string;
  points: number;
  huntTime: Date;
  updatedAt: Date;
}

export interface Article {
  id: number;
  title: string;
  type: string;
  publishAt: Date;
  content: string;
  messageType: string;
  maxPoints: number;
  endTime: Date;
}

export interface Marker {
  _id?: string;
  area: string;
  time: Date;
  location: {
    type: string;
    coordinates: number[];
  };
  type: MarkerType;
}

export enum MarkerType {
  Hunt = 'hunt',
  Hint = 'hint',
  Spot = 'spot',
}

export interface User {
  _id: string;
  email: string;
  name: string;
  admin: boolean;
  password: string;
}
