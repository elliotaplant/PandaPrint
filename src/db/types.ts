import { Document } from 'mongoose'
// A reflection of DB types

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

  get isEmptyOrder(): boolean {
    return this.pictureUrls.length === 0;
  }

  static emptyOrder(): Order {
    return new Order();
  }
}

export enum OrderStatus {
  Open,
  Sending,
  Closed
}

/**
  Class to represent pandaprint accounts in memory
 */
export interface EntryPpAccount {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: Address;
  phone: string;
  currentOrder?: Order;
  previousOrders?: Order[];
  stripeCustId?: string;
}

export interface PpAccount extends Document, EntryPpAccount { }
