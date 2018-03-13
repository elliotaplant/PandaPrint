import { Document } from 'mongoose';
// A reflection of DB types

// User account info

// IAddress matches PwintyAddress requirements
export interface IAddress {
  countryCode?: string;
  recipientName?: string;
  address1: string;
  address2?: string;
  addressTownOrCity: string;
  stateOrCounty: string;
  postalOrZipCode: string;
}

// IOrder types
export interface IOrder {
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
  Closed,
}

/**
 * Class to represent pandaprint accounts in memory
 */
export interface IEntryPpAccount {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: IAddress;
  phone: string;
  currentOrder?: IOrder;
  previousOrders?: IOrder[];
  stripeCustId?: string;
}

export interface IPpAccount extends Document, IEntryPpAccount { }
