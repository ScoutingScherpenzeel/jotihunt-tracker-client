export interface Device {
  id: number;
  attributes?: {
    deviceImage?: string;
  };
  groupId: number;
  groupName?: string;
  calendarId: number;
  name: string;
  uniqueId: string;
  status: string;
  lastUpdate: Date;
  positionId: number;
  phone?: string;
  model?: string;
  contact?: string;
  category?: string;
  disabled: boolean;
  expirationTime?: Date;
}
