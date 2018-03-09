import { Address, Order } from './types';
import { PpAccount } from './pp-account.class';
import * as mongoose from 'mongoose';
import { SchemaType, Document, Schema, Model } from 'mongoose';

/**
  A client for interacting with the database
  */

export class DbClient {
  private Account: Model<Document>;

  constructor() {
    const AddressSchema = new Schema({
      street1: String,
      street2: String,
      city: String,
      state: String,
      zip: String,
    });

    const OrderSchema = new Schema({
      pictureUrls: [String],
      status: Number,
      sendDate: Date,
      arriveDate: Date,
    });

    const AccountSchema = new Schema({
      firstName: String,
      lastName: String,
      email: String,
      address: AddressSchema,
      phone: String,
      currentOrder: OrderSchema,
      previousOrders: [OrderSchema],
      stripeCustId: String,
    });

    this.Account = mongoose.model('Account', AccountSchema);
  }

  public init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/pandaprint';

      mongoose.connect(mongoUri, error => {
        if (error) {
          console.error('Failed to start Mongo ');
          console.error(error);
          reject(error);
        } else {
          console.log(`Mongo connected to ${mongoUri}`);
          resolve();
        }
      });
    });
  }

  public loadAccountByPhone(phone: string): Promise<PpAccount> {
    return new Promise(resolve => {
      resolve(null);
    });
  }

  public createAccount(newAccount: PpAccount): Promise<PpAccount> {
    return new Promise(resolve => {
      resolve(null);
    });
  }

  public createAccountFromPhone(phone: string): Promise<PpAccount> {
    return new Promise(resolve => {
      resolve(null);
    });
  }

  public updateAccount(updatedAccount: PpAccount): Promise<PpAccount> {
    return new Promise(resolve => {
      resolve(null);
    });
  }

  public addPhotosToUsersCurrentOrder(photos: string[], phone: string) {
    return this.loadAccountByPhone(phone)
      .then(account => {
        return null;
      });
  }
}
