import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetcher = async (url: string) => {
  const { data } = await axios.get(`${baseUrl}${url}`);
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
