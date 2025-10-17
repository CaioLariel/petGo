export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface AnimalData {
  id: number | string; 
  name: string;
  species: "cachorro" | "gato" | "";
  breed: string;
  icon?: any;
  latitude?: number;
  longitude?: number;
}

