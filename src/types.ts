/**
  A file for type definitions used throughout the app
  */

// User account info
export interface PpAccount {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: Address;
  phone: string;
  currentOrder: Order;
  previousOrders: Order[];
  billingInfo?: BillingInfo;
}

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
}


// Order types
export interface Order {
  pictureUrls: string[];
  status: OrderStatus;
  sendDate: number;
  arriveDate: number;
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
