import { Address, Order } from './types';
import { PpAccount } from './pp-account.class';

/**
  A client for interacting with the database
  */

export class DbClient {

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
