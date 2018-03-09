import { expect } from 'chai';
import { Address, Order } from './types';
import { EntryPpAccount, PpAccount } from './pp-account.class';
import { DbClient } from './db.client';

/**
  A client for interacting with the database
  */

describe('Db Client', () => {
  let dbClient: DbClient;

  before((done) => {
    dbClient = new DbClient();
    dbClient.init()
      .then(() => done())
      .catch(done);
  });

  afterEach((done) => {
    dbClient.clearAll()
      .then(() => done())
      .catch(done);
  });

  after((done) => {
    dbClient.close()
      .then(() => done())
      .catch(done);
  });

  describe('Account creation', () => {
    it('should create accounts with only phone number', (done) => {
      const mikeJonesPhone = '+12813308004';
      dbClient.createAccountFromPhone(mikeJonesPhone)
        .then(createdAccount => {
          expect(createdAccount.phone).to.equal(mikeJonesPhone);
          expect(createdAccount.currentOrder.pictureUrls).to.be.empty;
        })
        .then(() => done())
        .catch(done);
    });

    it('should create accounts with a full profile', (done) => {
      const soljaStreet = '1234 Solja St.';
      const soljaBoi: EntryPpAccount = {
        phone: '+16789998212',
        email: 'solja@boi.org',
        address: {
          street1: soljaStreet,
          street2: 'Unit 4',
          city: 'East Atlana',
          state: 'GA',
          zip: '90210',
        },
        firstName: 'Solja',
        lastName: 'Boi',
        currentOrder: Order.emptyOrder(),
        previousOrders: []
      };

      dbClient.createAccount(soljaBoi)
        .then(createdAccount => {
          expect(createdAccount.phone).to.equal(soljaBoi.phone);
          expect(createdAccount.email).to.equal(soljaBoi.email);
          expect(createdAccount.address.street1).to.equal(soljaStreet);
        })
        .then(() => done())
        .catch(done);
    });
  });

  describe('Account updating', () => {
    it('should update an account with shipping and billing info', (done) => {
      const mikeJonesPhone = '+12813308004';
      const mikeJonesInfo: EntryPpAccount = {
        phone: '+12813308004',
        email: 'mike@jones.org',
        address: {
          street1: 'who?',
          street2: 'mike jones',
          city: 'East Atlana',
          state: 'GA',
          zip: '90210',
        },
        firstName: 'Mike',
        lastName: 'Jones',
        stripeCustId: 'FLOSSIN',
      };

      dbClient.createAccountFromPhone(mikeJonesPhone)
        .then(createdAccount => {
          expect(createdAccount.phone).to.equal(mikeJonesPhone);
          expect(createdAccount.firstName).to.be.undefined;
          return dbClient.updateAccount(mikeJonesInfo);
        })
        .then(updatedAccount => {
          expect(updatedAccount.phone).to.equal(mikeJonesPhone);
          expect(updatedAccount.firstName).to.equal(mikeJonesInfo.firstName);
          expect(updatedAccount.address.street1).to.equal(mikeJonesInfo.address.street1);
          expect(updatedAccount.stripeCustId).to.equal(mikeJonesInfo.stripeCustId);
        })
        .then(() => done())
        .catch(done);
    });
  });
});
