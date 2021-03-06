import { expect } from 'chai';
import { DbClient } from './db.client';
import { IAddress, IEntryPpAccount, IOrder, IPpAccount, OrderStatus } from './types';

/**
 * A client for interacting with the database
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
        .then((createdAccount) => {
          expect(createdAccount.phone).to.equal(mikeJonesPhone);
          expect(createdAccount.currentOrder.pictureUrls).to.be.empty;
        })
        .then(() => done())
        .catch(done);
    });

    it('should create accounts with a full profile', (done) => {
      const soljaStreet = '1234 Solja St.';
      const soljaBoi: IEntryPpAccount = {
        address: {
          address1: soljaStreet,
          address2: 'Unit 4',
          addressTownOrCity: 'East Atlana',
          postalOrZipCode: '90210',
          stateOrCounty: 'GA',
        },
        currentOrder: {
          pictureUrls: [],
          status: OrderStatus.Open,
        },
        email: 'solja@boi.org',
        firstName: 'Solja',
        lastName: 'Boi',
        phone: '+16789998212',
        previousOrders: [],
      };

      dbClient.createOrUpdateAccount(soljaBoi)
        .then((createdAccount) => {
          expect(createdAccount.phone).to.equal(soljaBoi.phone);
          expect(createdAccount.email).to.equal(soljaBoi.email);
          expect(createdAccount.address.address1).to.equal(soljaStreet);
        })
        .then(() => done())
        .catch(done);
    });
  });

  describe('Account updating', () => {
    it('should update an account with shipping and billing info', (done) => {
      const mikeJonesPhone = '+12813308004';
      const mikeJonesInfo: IEntryPpAccount = {
        address: {
          address1: 'who?',
          address2: 'mike jones',
          addressTownOrCity: 'East Atlana',
          postalOrZipCode: '90210',
          stateOrCounty: 'GA',
        },
        email: 'mike@jones.org',
        firstName: 'Mike',
        lastName: 'Jones',
        phone: '+12813308004',
        stripeCustId: 'FLOSSIN',
      };

      dbClient.createAccountFromPhone(mikeJonesPhone)
        .then((createdAccount) => {
          expect(createdAccount.phone).to.equal(mikeJonesPhone);
          expect(createdAccount.firstName).to.be.undefined;
          return dbClient.updateAccount(mikeJonesInfo);
        })
        .then((updatedAccount) => {
          expect(updatedAccount.phone).to.equal(mikeJonesPhone);
          expect(updatedAccount.firstName).to.equal(mikeJonesInfo.firstName);
          expect(updatedAccount.address.address1).to.equal(mikeJonesInfo.address.address1);
          expect(updatedAccount.stripeCustId).to.equal(mikeJonesInfo.stripeCustId);
        })
        .then(() => done())
        .catch(done);
    });
  });
});
