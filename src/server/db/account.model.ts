import { Model, Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { OrderStatus, PpAccount } from './types';

/** File for defining the DB model for accounts only once */

const AddressSchema = new Schema({
  address1: String,
  address2: String,
  city: String,
  state: String,
  zip: String,
});

const OrderSchema = new Schema({
  pictureUrls: { type: [String], default: [] }, // somehow make this mandatory on creation
  status: { type: Number, default: OrderStatus.Open },
  sendDate: Date,
  arriveDate: Date,
});

const AccountSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  address: AddressSchema,
  phone: String,
  currentOrder: { type: OrderSchema, default: OrderSchema }, // somehow make this mandatory new Order on creation
  previousOrders: [OrderSchema], // somehow make this mandatory [] on creation
  stripeCustId: String,
});

export const Account: Model<PpAccount> = mongoose.model('Account', AccountSchema);
