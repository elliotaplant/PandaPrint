import { expect } from 'chai';
import { IAddress, IOrder, OrderStatus } from '../db';
import { ErrorActuator } from '../error';
import { Utils } from '../utils';
import { TestUtils } from '../utils/index.spec';
import { PwintyClient } from './pwinty.client';
import { IPwintyOrder, IPwintyPhoto, IPwintyPhotoOrder } from './types';

/**
 * Tests for the PwintyClient
 */

describe('Pwinty Client', function() {
  // Increase the default timeout for these tests since they are hitting the sandbox pwinty api
  this.timeout(30000);

  // Example address to use
  let pinappleUnderTheSea: IAddress;
  let photoOrder: IOrder;
  let pwintyClient: PwintyClient;

  beforeEach(() => {
    pinappleUnderTheSea = {
      address1: '124 Conch Street',
      addressTownOrCity: 'Bikini Bottom',
      countryCode: 'US',
      postalOrZipCode: '96970',
      recipientName: 'Sponge Bob',
      stateOrCounty: 'Marshall Islands',
    };

    photoOrder = {
      pictureUrls: ['https://goo.gl/vUZvpc', 'https://goo.gl/zZY3hr'],
      status: OrderStatus.Open,
    };

    pwintyClient = new PwintyClient();
    pwintyClient.init();
  });

  describe('Creating orders', () => {
    TestUtils.ifApiTests(() => {
      it('should create an order with a pwinty address', (done) => {
        pwintyClient.createPwintyOrder(pinappleUnderTheSea)
          .then((createdOrder) => {
            expect(createdOrder.id).to.have.length;
            return pwintyClient.getPwintyOrderStatus(createdOrder.id);
          })
          .then((orderStatus) => {
            expect(orderStatus.isValid).to.be.false;
            expect(orderStatus.photos).to.be.empty;
            expect(orderStatus.generalErrors).to.contain('NoItemsInOrder');
            done();
          })
          .catch(done);
      });
    });
  });

  describe('Adding photos to order', () => {
    TestUtils.ifApiTests(() => {
      it('should add photos to an order', (done) => {
        pwintyClient.createPwintyOrder(pinappleUnderTheSea)
          .then((pwintyOrder) => ({ ...photoOrder, pwintyOrderId: pwintyOrder.id } as IOrder))
          .then((createdOrder) => pwintyClient.addPhotosToPwintyOrder(createdOrder))
          .then((orderWithPhotos) => {
            // Adding photos to order should return the original order and leave the order open
            expect(orderWithPhotos.status).to.equal(OrderStatus.Open);
            return orderWithPhotos;
          })
          .then((createdOrder) => pwintyClient.getPwintyOrderStatus(createdOrder.pwintyOrderId))
          .then((orderStatus) => {
            expect(orderStatus.isValid).to.be.true;
            expect(orderStatus.photos).to.have.length(photoOrder.pictureUrls.length);
            done();
          })
          .catch(done);
      });
    });
  });

  describe('Submitting an order', () => {

    TestUtils.ifApiTests(() => {
      it('should submit a fully valid order', (done) => {
        // Mark the payment as paid for
        photoOrder.paymentReceipt = '123 Stripe Payment ID';

        pwintyClient.sendOrderToPwinty(photoOrder, pinappleUnderTheSea, 'Sponebob Squarepants')
          .then((createdOrder) => pwintyClient.getPwintyOrderStatus(createdOrder.pwintyOrderId))
          .then((orderStatus) => {
            expect(orderStatus.isValid).to.be.true;
            expect(orderStatus.photos).to.have.length(photoOrder.pictureUrls.length);
            done();
          })
          .catch(done);
      });
    });

    it('should throw an error if trying to submit an unpayedfor order', (done) => {
      // Mark the payment as not paid for
      photoOrder.paymentReceipt = null;

      pwintyClient.sendOrderToPwinty(photoOrder, pinappleUnderTheSea, 'Sponebob Squarepants')
        .then(() => done('Expected unpaid order to throw an error'))
        .catch((error) => {
          expect(error).to.contain('not been paid');
          done();
        });
    });
  });
});
