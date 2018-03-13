import * as mongoose from 'mongoose';
import { Account } from './account.model';
import { IEntryPpAccount, IPpAccount } from './types';

/**
 * A client for interacting with the database
 */
export class DbClient {

  // tslint:disable
  public init(): Promise<void> {
    const mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/pandaprint';

    return mongoose.connect(mongoUri)
      .then(() => console.log(`Mongo connected to ${mongoUri}`))
      .catch((error) => {
        console.error('Failed to start Mongo');
        console.error(error);
      });
  }

  public close(): Promise<void> {
    return mongoose.disconnect()
      .catch((error) => {
        console.error('Failed to disconnect from Mongo');
        console.error(error);
      });
  }
  // tslint:enable

  public loadAccountByPhone(phone: string): Promise<IPpAccount> {
    return Account.findOne({ phone }).then();
  }

  public createAccount(newAccount: IEntryPpAccount): Promise<IPpAccount> {
    return Account.create(newAccount);
  }

  public createAccountFromPhone(phone: string): Promise<IPpAccount> {
    return Account.create({ phone });
  }

  public updateAccount(updatedAccount: IEntryPpAccount): Promise<IPpAccount> {
    return Account.findOne({ phone: updatedAccount.phone })
      .then((found) => {
        found.set(updatedAccount);
        return found.save();
      });
  }

  public addPhotosToUsersCurrentOrder(photos: string[], phone: string) {
    return this.loadAccountByPhone(phone)
      .then((account) => {
        account.currentOrder.pictureUrls.push(...photos);
        return account.save();
      });
  }

  public clearAll(): Promise<void> {
    // if env is prod, throw error
    return Account.remove({}).then(() => null);
  }
}
