import { expect } from 'chai';
import * as sinon from 'sinon';
import { IEntryPpAccount, IOrder, OrderStatus } from '../db';
import { BillingActuator } from './billing.actuator';
import { MockStripeClient } from './mock.stripe.client.spec';

// Spec file for BillingActuator
describe('Billing Actuator', () => {
  let billingActuator: BillingActuator;
  let stripeClient: MockStripeClient;

  beforeEach(() => {
    stripeClient = new MockStripeClient();
    billingActuator = new BillingActuator(stripeClient);
  });

  describe('Price Calculation', () => {
    it('should calculate price of order accurately', () => {
      const fourPicOrder: IOrder = {
        pictureUrls: ['pic1', 'pic2', 'pic3', 'pic4'],
        status: OrderStatus.Open,
      };

      const calculatedPrice = billingActuator.calculatePriceForOrder(fourPicOrder);
      // hard code in price calculation. Shouls this test be less brittle?
      expect(calculatedPrice).to.equal(3.49 + 4 * 0.49);
    });

    it('should calculate an empty order as zero dollars', () => {
      const emptyOrder: IOrder = {
        pictureUrls: [],
        status: OrderStatus.Open,
      };
      const calculatedPrice = billingActuator.calculatePriceForOrder(emptyOrder);
      expect(calculatedPrice).to.equal(0);
    });
  });

  describe('Customer charging', () => {
    let stripeChargeStub: sinon.SinonStub;
    let account: IEntryPpAccount;
    let order: IOrder;

    beforeEach(() => {
      account = { phone: '+12345678910' };
      order = {
        pictureUrls: [],
        status: OrderStatus.Open,
      };

      stripeChargeStub = sinon.stub(stripeClient, 'chargeCustomer').returns(Promise.resolve(true));
    });

    describe('Valid charges', () => {
      beforeEach(() => {
        account.stripeCustId = 'id123';
        order.pictureUrls.push(...['a', 'b', 'c']);
      });

      it('should use the stripe api to charge a customer', (done) => {
        billingActuator.chargeCustomerForOrder(account, order)
          .then(() => {
            expect(stripeChargeStub.calledOnce).to.be.true;
            done();
          })
          .catch(done);
      });

      it('should charge the right customer the right amoung', (done) => {
        billingActuator.chargeCustomerForOrder(account, order)
          .then(() => {
            expect(stripeChargeStub.calledWith(account.stripeCustId,
              billingActuator.calculatePriceForOrder(order))).to.be.true;
            done();
          })
          .catch(done);
      });
    });

    describe('Invalid charges', () => {
      afterEach(() => {
        expect(stripeChargeStub.notCalled).to.be.true;
      });

      it('should throw an error if trying to charge customer for empty order', (done) => {
        account.stripeCustId = 'id123';
        try {
          billingActuator.chargeCustomerForOrder(account, order);
          done(new Error('Expected customer charge to fail for empty order'));
        } catch (error) {
          expect(error.message.toLowerCase()).to.contain('empty order');
          done();
        }
      });

      it('should throw an error if trying to charge customer without a stripe customer id', (done) => {
        order.pictureUrls = ['1'];
        try {
          billingActuator.chargeCustomerForOrder(account, order);
          done(new Error('Expected customer charge to fail for customer with no stripe customer id'));
        } catch (error) {
          expect(error.message.toLowerCase()).to.contain('stripe customer id');
          done();
        }
      });
    });
  });
});
