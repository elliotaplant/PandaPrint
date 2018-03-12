// Types for printing

export interface PwintyAddress {
  countryCode?: string;
  recipientName?: string;
  address1?: string;
  address2?: string;
  addressTownOrCity?: string;
  stateOrCounty?: string;
  postalOrZipCode?: string;
}

export interface PwintyOrder {
  id: string;
}

export interface PwintyPhoto {
  id: string;
}

export interface PwintyPhotoOrder {
  type: string;
  attributes: {
    finish: string;
  };
  url: string;
  copies: string;
  sizing: string;
}
