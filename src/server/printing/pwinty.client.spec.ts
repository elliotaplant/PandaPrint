import { expect } from 'chai';
import { ErrorActuator } from '../error';
import { OrderStatus, Order, Address } from '../db';
import { PwintyAddress, PwintyOrder, PwintyPhotoOrder, PwintyPhoto } from './types';
import { PwintyClient } from './pwinty.client';
const pwintyKeys = require('../../../keys.json').pwinty;

/**
  Tests for the PwintyClient
*/

describe('Pwinty Client', function() {
  // Increase the default timeout for these tests since they are hitting the sandbox pwinty api
  this.timeout(5000);

  // Example address to use
  const pinappleUnderTheSea: PwintyAddress = {
    countryCode: 'US',
    recipientName: 'Sponge Bob',
    address1: '124 Conch Street',
    addressTownOrCity: 'Bikini Bottom',
    stateOrCounty: 'Marshall Islands',
    postalOrZipCode: '96970',
  };

  const photoOrder: Order = {
    pictureUrls: ['https://goo.gl/vUZvpc', 'https://goo.gl/73cm6d'],
    status: OrderStatus.Open,
  }

  let pwintyClient: PwintyClient;

  beforeEach(() => {
    pwintyClient = new PwintyClient(pwintyKeys.merchantId, pwintyKeys.apiKey, 'sandbox');
    pwintyClient.init()
  });

  describe('Creating orders', () => {
    it('should create an order with a pwinty address', (done) => {
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

  describe('Adding photos to order', () => {
    it('should create an order with a pwinty address', (done) => {
      pwintyClient.createPwintyOrder(pinappleUnderTheSea)
        .then(pwintyOrder => (<Order>{ ...photoOrder, pwintyOrderId: pwintyOrder.id }))
        .then(createdOrder => pwintyClient.addPhotosToPwintyOrder(createdOrder) )
        .then(orderWithPhotos => {
          // Adding photos to order should return the original order and leave the order open
          expect(orderWithPhotos.status).to.equal(OrderStatus.Open);
          return orderWithPhotos;
        })
        .then(createdOrder => pwintyClient.getPwintyOrderStatus(createdOrder.pwintyOrderId))
        .then(orderStatus => {
          expect(orderStatus.isValid).to.be.true;
          expect(orderStatus.photos).to.have.length(2);
          console.log('orderStatus', orderStatus);
          done();
        })
        .catch(done);
    });
  });
});
