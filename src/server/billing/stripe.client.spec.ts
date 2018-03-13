import * as Stripe from 'stripe';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { StripeClient } from './stripe.client';
import { Order, OrderStatus, EntryPpAccount } from '../db';

/**
  Tests for stripe client
 */


// Spec file for BillingActuator
describe('Stripe Client', () => {
  let stripeClient: StripeClient;

  beforeEach(() => {
    stripeClient = new StripeClient();
    stripeClient.init();
  });

  describe('Create customer', () => {
    const exampleCustomerEmail = 'kim@possible.com';
    const exampleCardToken = 'tok_visa';

    it.only('should create a customer with an email', (done) => {
      stripeClient.createCustomer(exampleCustomerEmail, exampleCardToken)
        .then(stripeCustomer => {
          expect(stripeCustomer.id).to.not.be.empty;
          expect(stripeCustomer.email).to.equal(exampleCustomerEmail);
        })
        .then(() => done())
        .catch(done)
    });
  });
});
