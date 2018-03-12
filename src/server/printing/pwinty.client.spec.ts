import { expect } from 'chai';
import { ErrorActuator } from '../error';
import { OrderStatus, Order, Address } from '../db';
import { PwintyOrder, PwintyPhotoOrder, PwintyPhoto } from './types';
import { PwintyClient } from './pwinty.client';
const pwintyKeys = require('../../../keys.json').pwinty;

/**
  Tests for the PwintyClient
*/

describe('Pwinty Client', function() {
  // Increase the default timeout for these tests since they are hitting the sandbox pwinty api
  this.timeout(10000);

  // Example address to use
  let pinappleUnderTheSea: Address;
  let photoOrder: Order;
  let pwintyClient: PwintyClient;

  beforeEach(() => {
    pinappleUnderTheSea = {
      countryCode: 'US',
      recipientName: 'Sponge Bob',
      address1: '124 Conch Street',
      addressTownOrCity: 'Bikini Bottom',
      stateOrCounty: 'Marshall Islands',
      postalOrZipCode: '96970',
    };

    photoOrder = {
      pictureUrls: ['https://goo.gl/vUZvpc', 'https://goo.gl/zZY3hr'],
      status: OrderStatus.Open,
    }

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
    it('should add photos to an order', (done) => {
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
          expect(orderStatus.photos).to.have.length(photoOrder.pictureUrls.length);
          done();
        })
        .catch(done);
    });
  });

  describe('Submitting an order', function() {

    it('should submit a fully valid order', (done) => {
      // Mark the payment as paid for
      photoOrder.paymentReceipt = '123 Stripe Payment ID';

      pwintyClient.sendOrderToPwinty(photoOrder, pinappleUnderTheSea, 'Sponebob Squarepants')
        .then(createdOrder => pwintyClient.getPwintyOrderStatus(createdOrder.pwintyOrderId))
        .then(orderStatus => {
          console.log('orderStatus', JSON.stringify(orderStatus));
          expect(orderStatus.isValid).to.be.true;
          expect(orderStatus.photos).to.have.length(photoOrder.pictureUrls.length);
          done();
        })
        .catch(done);
    });

    it('should throw an error if trying to submit an unpayedfor order', (done) => {
      // Mark the payment as not paid for
      photoOrder.paymentReceipt = null;

      pwintyClient.sendOrderToPwinty(photoOrder, pinappleUnderTheSea, 'Sponebob Squarepants')
        .then(() => done('Expected unpaid order to throw an error'))
        .catch(error => {
          expect(error).to.contain('not been paid');
          done();
        });
    });
  });
});
