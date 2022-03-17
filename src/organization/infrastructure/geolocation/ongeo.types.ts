export namespace OngeoTypes {
  export interface Point {
    type: string;
    coordinates: [number, number];
  }

  export interface Address {
    country: string;
    state: string;
    province: string;
    municipality: string;
    city: string;
    street: string;
    houseNumber?: any;
  }

  export interface GeolocationSearchResponse {
    label: string;
    point: Point;
    address: Address;
    type: string;
    score: number;
  }
}
