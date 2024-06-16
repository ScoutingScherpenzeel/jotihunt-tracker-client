import axios from "axios";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetcher = async (url: string) => {
  const { data } = await axios.get(`${baseUrl}${url}`);
  if(data.error) throw new Error(data.error);
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
        batteryLevel: string,
        distance: number,
        totalDistance: number,
        motion: false,
    },
    deviceId: number,
    latitude: number,
    longitude: number,
    speed: number,
    course: number,
    accuracy: number,
    deviceName: string,
}