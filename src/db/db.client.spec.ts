import { expect } from 'chai';
import { Address, Order } from './types';
import { PpAccount } from './pp-account.class';
import { DbClient } from './db.client';

/**
  A client for interacting with the database
  */

describe('Db Client', () => {
  let dbClient: DbClient;

  beforeEach(() => {
    dbClient = new DbClient();
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
      const soljaBoi = PpAccount.fromSignupFormRequest({
        phone: '+16789998212',
        email: 'solja@boi.org',
        street1: soljaStreet,
        street2: 'Unit 4',
        city: 'East Atlana',
        state: 'GA',
        zip: '90210',
        firstName: 'Solja',
        lastName: 'Boi',
      });

      dbClient.createAccount(soljaBoi)
        .then(createdAccount => {
          expect(createdAccount.phone).to.equal(soljaBoi.phone);
          expect(createdAccount.email).to.equal(soljaBoi.email);
          expect(createdAccount.address.street1).to.equal(soljaStreet);
        })
        .then(() => done())
        .catch(done);
    });

  })
});