import { PpAccount } from './pp-account.class';
import { OrderStatus } from '../type';
import { expect } from 'chai';

// Spec file for PpAccount
describe('PpAccount', () => {

  describe('constructor', () => {
    let account: PpAccount;

    beforeEach(() => {
      account = new PpAccount();
    });

    it('should create an account with an empty current order and no previous orders', () => {
      expect(account.currentOrder.pictureUrls).to.be.empty;
      expect(account.currentOrder.status).to.equal(OrderStatus.Open);
      expect(account.previousOrders).to.be.empty;
    });
  });
});
