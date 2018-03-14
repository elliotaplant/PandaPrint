import { Model, Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { IAddress, IEntryPpAccount, IPpAccount, OrderStatus } from './types';

/**
 * File for defining the DB model for accounts only once
 */
type AddressKeys = { [key in keyof IAddress]: any };
interface IAddressSchemaDefinition extends AddressKeys, mongoose.SchemaDefinition { }

const AddressSchema = new Schema({
  address1: String,
  address2: String,
  addressTownOrCity: String,
  postalOrZipCode: String,
  stateOrCounty: String,
} as IAddressSchemaDefinition);

const OrderSchema = new Schema({
  arriveDate: Date,
  pictureUrls: { type: [String], default: [] }, // somehow make this mandatory on creation
  sendDate: Date,
  status: { type: Number, default: OrderStatus.Open },
});

type AccountKeys = { [key in keyof IEntryPpAccount]: any };
interface IAccountSchemaDefinition extends AccountKeys, mongoose.SchemaDefinition { }

const AccountSchema = new Schema({
  address: AddressSchema,
  currentOrder: { type: OrderSchema, default: OrderSchema }, // somehow make this mandatory new IOrder on creation
  email: String,
  firstName: String,
  lastName: String,
  phone: String,
  previousOrders: [OrderSchema], // somehow make this mandatory [] on creation
  stripeCustId: String,
} as IAccountSchemaDefinition);

export const Account: Model<IPpAccount> = mongoose.model('Account', AccountSchema);
