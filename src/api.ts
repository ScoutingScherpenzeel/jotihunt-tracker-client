import axios from "axios";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetcher = async (url: string) => {
  const { data } = await axios.get(`${baseUrl}${url}`);
  if (data.error) throw new Error(data.error);
  return data;
};

export const post = async (url: string, body: any) => {
  const { data } = await axios.post(`${baseUrl}${url}`, body);
  if (data.error) throw new Error(data.error);
  return data;
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
  area: string;
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
}