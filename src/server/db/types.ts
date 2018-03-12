import { Document } from 'mongoose'
// A reflection of DB types

// User account info

// Address matches PwintyAddress requirements
export interface Address {
  countryCode?: string;
  recipientName?: string;
  address1: string;
  address2?: string;
  addressTownOrCity: string;
  stateOrCounty: string;
  postalOrZipCode: string;
}

// Order types
export interface Order {
  pictureUrls: string[];
  // Is this denormalizing the data?
  status: OrderStatus;
  sendDate?: number;
  arriveDate?: number;
  paymentReceipt?: string;
  pwintyOrderId?: string;
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
