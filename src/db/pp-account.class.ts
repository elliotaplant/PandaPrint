import { Order, Address } from './types'
import { Document, Model, MongooseDocument } from 'mongoose'
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
