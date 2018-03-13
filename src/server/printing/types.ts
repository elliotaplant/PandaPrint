// Types for printing

export interface IPwintyOrder {
  id: string;
}

export interface IPwintyPhoto {
  id: string;
}

export interface IPwintyPhotoOrder {
  type: string;
  attributes: {
    finish: string;
  };
  url: string;
  copies: string;
  sizing: string;
}

export interface IPwintyOrderStatus {
  id: string;
  isValid: boolean;
  photos: IPwintyPhoto[];
  generalErrors: string[];
}
