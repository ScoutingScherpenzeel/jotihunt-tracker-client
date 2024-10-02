export interface Position {
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
