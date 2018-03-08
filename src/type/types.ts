/**
  A file for type definitions used throughout the app
  */

// User account info
export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
}

export interface SignupAccountRequest {
  firstName: string;
  lastName: string;
  email: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  stripeToken: string;
}


// Order types
export class Order {
  pictureUrls: string[];
  status: OrderStatus;
  sendDate?: number;
  arriveDate?: number;

  constructor() {
    this.pictureUrls = [];
    this.status = OrderStatus.Open;
  }

  get isEmptyOrder(): boolean {
    return this.pictureUrls.length === 0;
  }
}

export enum OrderStatus {
  Open,
  Sending,
  Closed
}

// Twilio types
export interface TwilioBody {
  Body: string;
  MediaUrl0: string;
  MediaUrl1: string;
  MediaUrl2: string;
  MediaUrl3: string;
  MediaUrl4: string;
  MediaUrl5: string;
  MediaUrl6: string;
  MediaUrl7: string;
  MediaUrl8: string;
  MediaUrl9: string;
}
