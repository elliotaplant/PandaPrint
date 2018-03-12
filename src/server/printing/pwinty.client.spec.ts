import { expect } from 'chai';
import { ErrorActuator } from '../error';
import { Order, Address } from '../db';
import { PwintyAddress, PwintyOrder, PwintyPhotoOrder, PwintyPhoto } from './types';
import { PwintyClient } from './pwinty.client';
const pwintyKeys = require('../keys.json').pwinty;

/**
  Tests for the PwintyClient
*/

describe('Db Client', () => {
  let pwintyClient: PwintyClient;

  beforeEach(() => {
    pwintyClient = new PwintyClient(pwintyKeys.merchantId, pwintyKeys.apiKey, 'sandbox');
    pwintyClient.init()
  });

  describe('Account creation', () => {
    it('should create accounts with only phone number', (done) => {
      const mikeJonesPhone = '+12813308004';
      pwintyClient.createAccountFromPhone(mikeJonesPhone)
        .then(createdAccount => {
          expect(createdAccount.phone).to.equal(mikeJonesPhone);
          expect(createdAccount.currentOrder.pictureUrls).to.be.empty;
        })
        .then(() => done())
        .catch(done);
    });
  });
});
