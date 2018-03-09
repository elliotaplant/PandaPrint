import { Address, Order, OrderStatus } from './types';
import { EntryPpAccount, PpAccount } from './pp-account.class';
import * as mongoose from 'mongoose';
import { SchemaType, Document, Schema, Model } from 'mongoose';

/**
  A client for interacting with the database
  */

export class DbClient {
  private Account: Model<PpAccount>;

  constructor() {
    const AddressSchema = new Schema({
      street1: String,
      street2: String,
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
      currentOrder: {type: OrderSchema, default: OrderSchema }, // somehow make this mandatory new Order on creation
      previousOrders: [OrderSchema], // somehow make this mandatory [] on creation
      stripeCustId: String,
    });

    this.Account = mongoose.model('Account', AccountSchema);
  }

  public init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/pandaprint';

      mongoose.connect(mongoUri, error => {
        if (error) {
          console.error('Failed to start Mongo');
          console.error(error);
          reject(error);
        } else {
          console.log(`Mongo connected to ${mongoUri}`);
          resolve();
        }
      });
    });
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      const mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/pandaprint';

      mongoose.disconnect(error => {
        if (error) {
          console.error('Failed to disconnect from Mongo');
          console.error(error);
          reject(error);
        } else {
          console.log(`Mongo disconnected`);
          resolve();
        }
      });
    });
  }

  public loadAccountByPhone(phone: string): Promise<PpAccount> {
    return this.Account.findOne({ phone }).then();
  }

  public createAccount(newAccount: EntryPpAccount): Promise<PpAccount> {
    return this.Account.create(newAccount);
  }

  public createAccountFromPhone(phone: string): Promise<PpAccount> {
    return this.Account.create({ phone });
  }

  public updateAccount(updatedAccount: EntryPpAccount): Promise<PpAccount> {
    return this.Account.findOne({ phone: updatedAccount.phone })
      .then(foundAccount => ({ ...foundAccount, ...updatedAccount }.save()))
  }

  public addPhotosToUsersCurrentOrder(photos: string[], phone: string) {
    return this.loadAccountByPhone(phone)
      .then(account => {
        account.currentOrder.pictureUrls.push(...photos);
        return account.save();
      });
  }

  public clearAll(): Promise<void> {
    // if env is prod, throw error
    return this.Account.remove({}).then(() => null);
  }
}
