import { expect } from 'chai';
import * as sinon from 'sinon';
import * as Stripe from 'stripe';
import { EntryPpAccount, Order, OrderStatus } from '../db';
import { StripeClient } from './stripe.client';

/**
  Tests for stripe client
 */

// Spec file for BillingActuator
describe('Stripe Client', function() {
  // Hitting test stripe api, so time may be longer than 2000ms
  this.timeout(5000);

  let stripeClient: StripeClient;
  let exampleCustomerEmail: string;
  let exampleCardToken: string;

  beforeEach(() => {
    stripeClient = new StripeClient();
    stripeClient.init();

    exampleCustomerEmail = 'kim@possible.com';
    exampleCardToken = 'tok_visa';
  });

  describe('Create customer', () => {
    it('should create a customer with an email', () => {
      return stripeClient.createCustomer(exampleCustomerEmail, exampleCardToken)
        .then((stripeCustomer) => {
          expect(stripeCustomer.id).to.not.be.empty;
          expect(stripeCustomer.email).to.equal(exampleCustomerEmail);
        });
    });
  });

  describe('Charge customer', () => {
    let createdCustomerId: string;
    let exampleChargeAmount: number;

    beforeEach(() => {
      exampleChargeAmount = 420; // blaze up
      return stripeClient.createCustomer(exampleCustomerEmail, exampleCardToken)
        .then((createdCustomer) => createdCustomerId = createdCustomer.id);
    });

    it('should create a customer with an email', () => {
      return stripeClient.chargeCustomer(createdCustomerId, exampleChargeAmount)
        .then((charge) => {
          expect(charge.customer).to.equal(createdCustomerId);
          expect(charge.amount).to.equal(exampleChargeAmount);
        });
    });
  });
});
