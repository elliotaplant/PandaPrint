import * as Stripe from 'stripe';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { StripeClient } from './stripe.client';
import { Order, OrderStatus, EntryPpAccount } from '../db';

/**
  Tests for stripe client
 */


// Spec file for BillingActuator
describe('Stripe Client', function() {
  // Hitting test stripe api, so time may be longer than 2000ms
  this.timeout(5000);

  let stripeClient: StripeClient;

  beforeEach(() => {
    stripeClient = new StripeClient();
    stripeClient.init();
  });

  describe('Create customer', () => {
    const exampleCustomerEmail = 'kim@possible.com';
    const exampleCardToken = 'tok_visa';

    it('should create a customer with an email', () => {
      return stripeClient.createCustomer(exampleCustomerEmail, exampleCardToken)
        .then(stripeCustomer => {
          expect(stripeCustomer.id).to.not.be.empty;
          expect(stripeCustomer.email).to.equal(exampleCustomerEmail);
        });
    });
  });
});
