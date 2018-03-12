import { expect } from 'chai';
import { ErrorActuator } from '../error';
import { Order, Address } from '../db';
import { PwintyAddress, PwintyOrder, PwintyPhotoOrder, PwintyPhoto } from './types';
import { PwintyClient } from './pwinty.client';
const pwintyKeys = require('../../../keys.json').pwinty;

/**
  Tests for the PwintyClient
*/

describe('Pwinty Client', function() {
  // Increase the default timeout for these tests since they are hitting the sandbox pwinty api
  this.timeout(5000);

  let pwintyClient: PwintyClient;

  beforeEach(() => {
    pwintyClient = new PwintyClient(pwintyKeys.merchantId, pwintyKeys.apiKey, 'sandbox');
    pwintyClient.init()
  });

  describe.only('Creating order', () => {
    it('should create an order with a pwinty address', (done) => {
      const pinappleUnderTheSea: PwintyAddress = {
        countryCode: 'US',
        recipientName: 'Sponge Bob',
        address1: '124 Conch Street',
        addressTownOrCity: 'Bikini Bottom',
        stateOrCounty: 'Marshall Islands',
        postalOrZipCode: '96970',
      };

      pwintyClient.createPwintyOrder(pinappleUnderTheSea)
        .then(createdOrder => {
          expect(createdOrder.id).to.have.length;
          return pwintyClient.getPwintyOrderStatus(createdOrder.id)
        })
        .then(orderStatus => {
          expect(orderStatus.isValid).to.be.false;
          expect(orderStatus.photos).to.be.empty;
          expect(orderStatus.generalErrors).to.contain('NoItemsInOrder');
          done();
        })
        .catch(done);
    });
  });
});
