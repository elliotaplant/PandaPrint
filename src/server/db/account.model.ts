import { Model, Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { IPpAccount, OrderStatus } from './types';

/**
 * File for defining the DB model for accounts only once
 */

const AddressSchema = new Schema({
  address1: String,
  address2: String,
  city: String,
  state: String,
  zip: String,
});

const OrderSchema = new Schema({
  arriveDate: Date,
  pictureUrls: { type: [String], default: [] }, // somehow make this mandatory on creation
  sendDate: Date,
  status: { type: Number, default: OrderStatus.Open },
});

const AccountSchema = new Schema({
  address: AddressSchema,
  currentOrder: { type: OrderSchema, default: OrderSchema }, // somehow make this mandatory new IOrder on creation
  email: String,
  firstName: String,
  lastName: String,
  phone: String,
  previousOrders: [OrderSchema], // somehow make this mandatory [] on creation
  stripeCustId: String,
});

export const Account: Model<IPpAccount> = mongoose.model('Account', AccountSchema);
