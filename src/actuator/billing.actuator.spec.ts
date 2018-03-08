import { expect } from 'chai';
import { BillingActuator } from './billing.actuator';
import { Order } from '../type';

// Spec file for BillingActuator
describe('BillingActuator', () => {

  describe('Price Calculation', () => {
    let billingActuator: BillingActuator;

    beforeEach(() => {
      billingActuator = new BillingActuator();
    });

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
});
