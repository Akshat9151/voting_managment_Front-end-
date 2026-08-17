export interface MapBooth {
  id: number;
  name: string;
  voters: number;
  turnout: string;
  sensitive: 'Normal' | 'Sensitive';
  incharge: string;
  x: number;
  y: number;
}

export interface LocationData {
  name: string;
  district: string;
  totalWards: number;
  totalBooths: number;
  registeredVoters: string;
  turnoutTarget: string;
  sensitiveBooths: string;
  centerOffset: { x: number; y: number };
  booths: MapBooth[];
}
