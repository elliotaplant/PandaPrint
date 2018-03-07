import { PpAccount } from './types';
/**
  A client for interacting with the database
  */

export default class DbClient {
  private accounts: Map<string, PpAccount> = new Map();

  constructor() { }

  public loadAccountByPhone(phone: string): Promise<PpAccount> {
    return new Promise(resolve => {
      const foundAccount = this.accounts.get(phone);
      resolve(foundAccount);
    });
  }

  public createAccount(newAccount: PpAccount): Promise<PpAccount> {
    return new Promise(resolve => {
      this.accounts.set(newAccount.phone, newAccount);
      const foundAccount = this.accounts.get(newAccount.phone);
      resolve(foundAccount);
    });
  }

  public updateAccount(updatedAccount: PpAccount): Promise<PpAccount> {
    return new Promise(resolve => {
      this.accounts.set(updatedAccount.phone, updatedAccount);
      const foundAccount = this.accounts.get(updatedAccount.phone);
      resolve(foundAccount);
    });
  }

  public addPhotosToUsersCurrentOrder(photos: string[], phone: string) {
    return this.loadAccountByPhone(phone)
      .then(account => {
        const currentOrder = account.currentOrder;
        currentOrder.pictureUrls = currentOrder.pictureUrls.concat(photos);
        return account;
      });
  }
}
