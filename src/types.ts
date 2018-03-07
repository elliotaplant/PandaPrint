/**
  A file for type definitions used throughout the app
  */

// User account info
export class PpAccount {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: Address;
  phone: string;
  currentOrder: Order;
  previousOrders: Order[];
  billingInfo?: BillingInfo;

  constructor(phone: string) {
    this.phone = phone;
    this.currentOrder = new Order();
    this.previousOrders = [];
  }
}

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
