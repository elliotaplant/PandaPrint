import { DbClient } from './db.client';
import { IAddress, IEntryPpAccount, IOrder, IPpAccount } from './types';

/**
 * A mock to in memory db to represent the DbClient
 */

export class MockDbClient extends DbClient {
  // Private in-memory DB
  private accounts: Map<string, IPpAccount> = new Map();

  // Overrides
  public loadAccountByPhone(phone: string): Promise<IPpAccount> {
    return new Promise((resolve) => {
      const foundAccount = this.accounts.get(phone);
      resolve(foundAccount);
    });
  }

  public createOrUpdateAccount(newAccount: IEntryPpAccount): Promise<IPpAccount> {
    return new Promise((resolve) => {
      this.accounts.set(newAccount.phone, newAccount as any);
      const foundAccount = this.accounts.get(newAccount.phone);
      resolve(foundAccount);
    });
  }

  public createAccountFromPhone(phone: string): Promise<IPpAccount> {
    return new Promise((resolve) => {
      const newAccount: any = {
        currentOrder: { pictureUrls: [] },
        phone,
        previousOrders: [],
      };
      this.accounts.set(newAccount.phone, newAccount);
      const foundAccount = this.accounts.get(newAccount.phone);
      resolve(foundAccount);
    });
  }

  public updateAccount(updatedAccount: IEntryPpAccount): Promise<IPpAccount> {
    return new Promise((resolve) => {
      this.accounts.set(updatedAccount.phone, updatedAccount as any);
      const foundAccount = this.accounts.get(updatedAccount.phone);
      resolve(foundAccount);
    });
  }

  public addPhotosToUsersCurrentOrder(photos: string[], phone: string) {
    return this.loadAccountByPhone(phone)
      .then((account) => {
        const currentOrder = account.currentOrder;
        currentOrder.pictureUrls = currentOrder.pictureUrls.concat(photos);
        return account;
      });
  }
}
