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
