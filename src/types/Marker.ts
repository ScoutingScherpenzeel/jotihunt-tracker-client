import { MarkerType } from './MarkerType';

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
