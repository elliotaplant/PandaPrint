import { expect } from 'chai';
import * as sinon from 'sinon';
import { BillingActuator } from './billing.actuator';
import { StripeClient } from '../client';
import { Order } from '../type';

// Spec file for BillingActuator
describe('BillingActuator', () => {
  let billingActuator: BillingActuator;
  let stripeClient: StripeClient;

  beforeEach(() => {
    stripeClient = new StripeClient();
    billingActuator = new BillingActuator(stripeClient);
  });

  describe('Price Calculation', () => {

    it('should calculate price of order accurately', () => {
      const fourPicOrder = new Order();
      fourPicOrder.pictureUrls.push(...['pic1', 'pic2', 'pic3', 'pic4']);

      const calculatedPrice = billingActuator.calculatePriceForOrder(fourPicOrder);
      expect(calculatedPrice).to.equal(3.49 + 4 * 0.49);
    });

    it('should calculate an empty order as zero dollars', () => {
      const emptyOrder = new Order();
      const calculatedPrice = billingActuator.calculatePriceForOrder(emptyOrder);
      expect(calculatedPrice).to.equal(0);
    });
  });

  describe('Customer charging', () => {
    beforeEach(() => {
      const moo = () => Promise.resolve(true);
      // const stripeChargeSpy = sinon.stub(stripeClient, 'chargeCustomer', () => Promise.resolve(true));
    });

    it('should use the stripe api to charge a customer', () => {

    });
  });
});
