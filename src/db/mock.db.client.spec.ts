import { Address, Order } from './types';
import { DbClient } from './db.client';
import { EntryPpAccount, PpAccount } from './pp-account.class';

/**
  A mock to in memory db to represent the DbClient
  */

export class MockDbClient extends DbClient {
  // Private in-memory DB
  private accounts: Map<string, PpAccount> = new Map();

  // Overrides
  public loadAccountByPhone(phone: string): Promise<PpAccount> {
    return new Promise(resolve => {
      const foundAccount = this.accounts.get(phone);
      resolve(foundAccount);
    });
  }

  public createAccount(newAccount: EntryPpAccount): Promise<PpAccount> {
    return new Promise(resolve => {
      this.accounts.set(newAccount.phone, <any>newAccount);
      const foundAccount = this.accounts.get(newAccount.phone);
      resolve(foundAccount);
    });
  }

  public createAccountFromPhone(phone: string): Promise<PpAccount> {
    return new Promise(resolve => {
      const newAccount: any = {
        phone,
        currentOrder: { photoUrls: [] },
        previousOrders: []
      };
      this.accounts.set(newAccount.phone, newAccount);
      const foundAccount = this.accounts.get(newAccount.phone);
      resolve(foundAccount);
    });
  }

  public updateAccount(updatedAccount: EntryPpAccount): Promise<PpAccount> {
    return new Promise(resolve => {
      this.accounts.set(updatedAccount.phone, <any>updatedAccount);
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
