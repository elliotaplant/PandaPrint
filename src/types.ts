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
}

export enum OrderStatus {
  Open,
  Sending,
  Closed
}

// Billing types
export interface BillingInfo {
  cardNumber: string;
  expMonth: string;
  expYear: string;
  securityCode: string;
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
