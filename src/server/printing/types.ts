// Types for printing

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

export interface PwintyOrderStatus {
  id: string;
  isValid: boolean,
  photos: PwintyPhoto[];
  generalErrors: string[];
}
